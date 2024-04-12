
from flask import Flask, render_template, request, send_file

import json
import pandas as pd
import geopandas as gpd
import matplotlib.pyplot as plt
from io import BytesIO

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_map', methods=['POST'])
def generate_map():
    try:
        # Get the uploaded CSV file
        csv_file = request.files['csv_file']

        # Load the CSV file
        df = pd.read_csv(csv_file)

        # Create a dictionary mapping states to their average values
        state_average = dict(zip(df['State'], df['Average']))

        # Load the GeoJSON file
        with open('gadm41_IND_1.json', 'r') as f:
            geojson_data = json.load(f)

        # Iterate over features and add 'average' property
        for feature in geojson_data['features']:
            state_name = feature['properties']['NAME_1']
            if state_name in state_average:
                feature['properties']['average'] = state_average[state_name]
            else:
                feature['properties']['average'] = None  # Or any default value if average is not found

        # Save the updated GeoJSON file
        with open('gadm41_IND_1_with_average.json', 'w') as f:
            json.dump(geojson_data, f)

        # Load the GeoJSON file with average values
        gdf = gpd.read_file('gadm41_IND_1_with_average.json')

        # Set the scale factor for brightness adjustment
        scale_factor = 1.5  # You can adjust this value as needed to increase or decrease brightness

        # Calculate the new vmin and vmax based on the scale factor
        vmin = gdf['average'].min()
        vmax = gdf['average'].max() * scale_factor

        # Create a figure and axis
        fig, ax = plt.subplots(figsize=(12, 8))

        # Plot the GeoDataFrame on the axis, using the 'average' column for coloring
        gdf.plot(column='average', ax=ax, legend=True, cmap='viridis', edgecolor='black', linewidth=0.5, vmin=vmin, vmax=vmax)

        # Add title
        plt.title('Average Values per State')

        # Add labels for colorbar
        cbar = ax.get_figure().get_axes()[1]
        cbar.set_ylabel('Average Value')

        # Save the plot to a BytesIO object
        buffer = BytesIO()
        plt.savefig(buffer, format='png')
        buffer.seek(0)

        # Clear the plot
        plt.close()

        # Return the image file to the front end
        return send_file(buffer, mimetype='image/png')
    except Exception as e:
        return str(e), 400

if __name__ == '__main__':
    app.run(debug=True)
