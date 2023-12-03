// Get the data from the given url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetching the JSON data and console log it
d3.json(url).then(function(data) {
  console.log(data);

  //Loading data obtained into local variable 
  var samples_data = data;

  //Getting names data and appending it to the dropdown(#selDataset) menu options
  var names = samples_data.names;
  names.forEach(element => {
    d3.selectAll("#selDataset").append("option").text(element);
    });
   
    function init(){
        // Loading data for sample id 940 as the default sample
        var defaultData = samples_data.samples.filter(sample => sample.id === "940")[0];
		console.log("Sample id 940 data")
		console.log(defaultData);
        // Setting default sample_values, otu_ids and otu_labels of the selected test ID
		otuIdsDefault = defaultData.otu_ids;
        sampleValuesDefault = defaultData.sample_values;
		otuLabelsDefault = defaultData.otu_labels;
    
        // Select the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
		otuIdsTopTen = otuIdsDefault.slice(0, 10).reverse();
        sampleValuesTopTen = sampleValuesDefault.slice(0, 10).reverse();
		otuLabelsTopTen = otuLabelsDefault.slice(0, 10).reverse();

		console.log(otuIdsTopTen);
		console.log(sampleValuesTopTen);
		console.log(otuLabelsTopTen);

        // Creating trace and layout for Bar chart
        var trace1 = {
			x: sampleValuesTopTen,
			y: otuIdsTopTen.map(otuId => `OTU ${otuId}`),
			text: otuLabelsTopTen,
			type: "bar",
			orientation: "h"
		};

		
		var barData = [trace1];

		// Applying the group bar mode to the layout
		var barlayout = {
			title: `Top 10 OTUs found in selected Subject ID No`,
			xaxis: { title: "Sample Value"},
			yaxis: { title: "OTU ID"},
			autosize: false,
			width: 500,
			height: 700
		}

		// Creating Bar Plot with Plotly
		Plotly.newPlot("bar", barData, barlayout);


        // Creating trace and layout for Bubble chart
		var trace2 = {
			x: otuIdsDefault,
			y: sampleValuesDefault,
			text: otuLabelsDefault,
			mode: 'markers',
			marker: {
				color: otuIdsDefault,
				size: sampleValuesDefault
			}
		};
		
		var bubbleData = [trace2];
		
		var bubbleLayout = {
			title: 'Bubble Chart with sample values of OTU IDs of the selected individual',
			xaxis: { title: "OTU ID"},
			yaxis: { title: "Sample Value"}, 
			showlegend: false,
		};
		// Creating Bubble Plot with Plotly
		Plotly.newPlot('bubble', bubbleData, bubbleLayout);


        // Loading default demographic information
		demoDefault = data.metadata.filter(sample => sample.id === 940)[0];
		console.log(demoDefault);

		// Displaying each key-value pair from the metadata JSON object
		Object.entries(demoDefault).forEach(
			([key, value]) => d3.select("#sample-metadata")
													.append("p").text(`${key.toUpperCase()}: ${value}`));



    }
    init();
    d3.selectAll("#selDataset").on("change", updatePlot);

	
	// This function is called when a dropdown menu item is selected
	function updatePlot() {

		// Using D3 to select the dropdown menu
			var inputDropDown = d3.select("#selDataset");

		// Assigning the value of the dropdown menu option to a variable
			var dropDownValue = inputDropDown.property("value");
			console.log(dropDownValue);

		// Filtering the dataset based on inputValue ID
			dataset = samples_data.samples.filter(sample => sample.id === dropDownValue)[0];
			console.log(dataset);

		// Select all sample_values, otu_ids and otu_labels of the selected test ID
			sampleValues = dataset.sample_values;
			otuIds = dataset.otu_ids;
			otuLabels = dataset.otu_labels;

		// Select the top 10 OTUs for the ID with their sample_values, otu_ids and otu_labels
		top10SampleValues = sampleValues.slice(0, 10).reverse();
		top10OtuIds = otuIds.slice(0, 10).reverse();
		top10OtuLabels = otuLabels.slice(0, 10).reverse();

		// Updating bar chart with selected values
		Plotly.restyle("bar", "x", [top10SampleValues]);
		Plotly.restyle("bar", "y", [top10OtuIds.map(otuId => `OTU ${otuId}`)]);
		Plotly.restyle("bar", "text", [top10OtuLabels]);


        // Updating bubble chart with selected values
		Plotly.restyle('bubble', "x", [otuIds]);
		Plotly.restyle('bubble', "y", [sampleValues]);
		Plotly.restyle('bubble', "text", [otuLabels]);
		Plotly.restyle('bubble', "marker.color", [otuIds]);
		Plotly.restyle('bubble', "marker.size", [sampleValues]);


        // Updating the demographic info table
		metadataInfo = samples_data.metadata.filter(sample => sample.id == dropDownValue)[0];

		// Delete the current contents of the table
		d3.select("#sample-metadata").html("");

		// Display each key-value pair from the metadata JSON object
		Object.entries(metadataInfo).forEach(([key, value]) => d3.select("#sample-metadata").append("p").text(`${key}: ${value}`));

  };

 

 
    });