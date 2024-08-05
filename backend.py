from flask import Flask, jsonify, request
from pyspark.sql import SparkSession
from sedona.register import SedonaRegistrator
from sedona.utils import KryoSerializer, SedonaKryoRegistrator
import findspark

from sedona.core.enums import FileDataSplitter, GridType, IndexType
from sedona.core.formatMapper import WktReader
from sedona.core.SpatialRDD import PointRDD, LineStringRDD
from sedona.core.spatialOperator.sgpac_query import SGPACQuery
from sedona.core.spatialOperator.quadtree_ddcel import QuadTreeDDCEL
from pyspark.sql import Row
import pandas as pd

from flask_cors import CORS  # Import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for the entire app


findspark.init()
spark = SparkSession.builder.config("spark.jars", "sedona-spark-shaded-3.0_2.12-1.4.1-SNAPSHOT.jar")\
                            .config("spark.serializer", KryoSerializer.getName)\
                            .config("spark.kryo.registrator", SedonaKryoRegistrator.getName)\
                            .master("local[*]").getOrCreate()
SedonaRegistrator.registerAll(spark)

def determine_splitter(file_path):
    if file_path.endswith('.csv'):
        return FileDataSplitter.CSV
    elif file_path.endswith('.json') or file_path.endswith('.geojson'):
        return FileDataSplitter.GEOJSON
    elif file_path.endswith('.wkt'):
        return FileDataSplitter.WKT
    elif file_path.endswith('.shp'):
        return FileDataSplitter.SHAPEFILE
    else:
        raise ValueError('Unsupported file format')
    

@app.route('/call_sgpac', methods=['POST'])
def call_sgpac():
    received_data = request.json
    points = received_data['points_path']
    polygons = received_data['polygons_path']
    
    # Determine splitter based on input file type
    points_splitter = determine_splitter(points)
    polygons_splitter = determine_splitter(polygons)

    # TODO: splitter based on input (csv, json)
    # available options: FileDataSplitter.GEOJSON 
    # check https://sedona.apache.org/1.4.0/api/javadoc/core/org/apache/sedona/core/formatMapper/shapefileParser/ShapefileReader.html for shapefiles

    if points_splitter == FileDataSplitter.SHAPEFILE:
        data = ShapefileReader.readToGeometryRDD(spark.sparkContext, points)
    else:
        data = PointRDD(spark.sparkContext, points, 0, points_splitter, True)
    
    data.analyze()
    data.spatialPartitioning(GridType.QUADTREE, 200)
    data.buildIndex(IndexType.RTREE, True)
    
    # TODO: change this to read polygons from wkt/json/shap
    if polygons_splitter == FileDataSplitter.WKT:
        polygon_layer = WktReader.readToGeometryRDD(spark.sparkContext, polygons, 0, False, True)
    elif polygons_splitter == FileDataSplitter.GEOJSON:
        polygon_layer = GeoJsonReader.readToGeometryRDD(spark.sparkContext, polygons, False, True)
    elif polygons_splitter == FileDataSplitter.SHAPEFILE:
        polygon_layer = ShapefileReader.readToGeometryRDD(spark.sparkContext, polygons)
    else:
        raise ValueError('Unsupported file format for polygons')
    
    polygon_layer.spatialPartitioning(data.getPartitioner())
    result = SGPACQuery.sgpac2L(data, polygon_layer).collectAsMap()
    
    python_dict = {key: result.get(key) for key in result.keySet()}
    return jsonify({'response': python_dict})


@app.route('/call_ddcel', methods=['POST'])
def call_ddcel():
    received_data = request.json
    lines = received_data['lines_path']
    
    # Determine splitter based on input file type
    lines_splitter = determine_splitter(lines)

    # TODO: splitter based on input (csv, json, shapefile) same as above
    if lines_splitter == FileDataSplitter.SHAPEFILE:
        data = ShapefileReader.readToGeometryRDD(spark.sparkContext, lines)
    else:
        data = LineStringRDD(spark.sparkContext, lines, lines_splitter, False)
    
    ddcel = QuadTreeDDCEL(spark.sparkContext, data, 2000, 100)
    
    polygons = []
    for face in ddcel.faces:
        polygons.append(face.map(lambda x: Row(polygon=x.face)).toDF().toPandas())
    all_polygons = pd.concat(polygons)

    return jsonify({'polygons': all_polygons['polygon'].astype(str).tolist()})

if __name__ == '__main__':
    app.run(debug=True)