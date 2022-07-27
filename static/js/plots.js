function init() {
    var selector = d3.select("#selDataset");
  
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option") // Appends an option tag to the select tag (or the drop down menu) - basically adding a space for entry
          .text(sample) // Within the option tag it just created - sets the text/title to the value of the iterated entry (in text form)
          .property("value", sample); // Within the same option tag - also sets the value of that option tag to the value of the iterated entry
      });
  });
}
  
init();

// This function runs when a change in the dropdown menu is made - passed into the function is the value of the dropdown menu(indicated in the html file)
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);;
}
// Taking in the id value passed in from the dropdown menu, looks for the metadata in the json file with the same id - returns the location
function buildMetadata(sample) {
    // Opens up and iterates the the json data
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata; // storing the data[metadata] into a variable
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample); // filters the data to contain the indicated id
      var result = resultArray[0]; // returns the first object in the array
     
      var PANEL = d3.select("#sample-metadata"); // Finds the first tag with the sample-metadata id
      PANEL.html(""); //clears that tags content
      Object.entries(result).forEach(([key, value]) => {
          PANEL.append("h6").text(key.toUpperCase() +": " + value);

        });
    });
  }

  function buildCharts(sample){
      // Opens up and iterates the the json data
      d3.json("samples.json").then(data => {
          var sampleData = data.samples;
          var resultArray = sampleData.filter(sampleObj => sampleObj.id == sample); // filters the data to contain the indicated id
          var result = resultArray[0]; // returns the first object in the array

          var otu_ids = result.otu_ids.map(function(id) {return ("OTU: " + id)}).slice(0,10).reverse();
          var otu_labels = result.otu_labels.slice(0,10).reverse();
          var sample_values = result.sample_values.slice(0,10).reverse();

          var yticks = [];
        // Graphing a horizontal bar graph
          var trace_1 = {
              x: sample_values,
              y: otu_ids,
              text: otu_labels,
              type: "bar",
              orientation: 'h'
          };
          
          var data = [trace_1];

          var layout = {
            title: {
                text: "Top 10 Bacteria Cultures Found",
                font: {size: 24}
            },
            paper_bgcolor: "#757171",
            xaxis: {title: "Sample Count"},
            yaxis: {title: "Sample ID", titlefont:{size: 12}},
            font: {color: 'black'}
        };

        Plotly.newPlot("bar", data, layout, {responsive: true});

        // Graphing a bubble chart
        var trace_2 = {
            x: result.otu_ids,
            y: result.sample_values,
            text: result.otu_labels,
            mode: 'markers',
            marker:{
                size: result.sample_values, 
                color: result.otu_ids,
                colorscale: 'Jet'
            }
        };

        var layout_2 = {
            title: {
                text: 'Bacteria Cultures Per Sample',
                font: {size: 30}
            },
            paper_bgcolor: "#757171",
            font: {color: 'black'},
            xaxis: {title: "OTU ID"},
            yaxis: {title: "Sample Count", titlefont:{size: 12}}
        }

        Plotly.newPlot('bubble', [trace_2], layout_2, {responsive: true});
        
        //   console.log(result.otu_ids);
        //   console.log(otu_labels);
        //   console.log("Sample " , sample_values);

      });

      // graphing gauge chart
      d3.json("samples.json").then(data => {
        var metaData = data.metadata;
        var metaDataArray = metaData.filter(sampleObj => sampleObj.id == sample); // filters the data to contain the indicated id
        var results = metaDataArray[0]; // returns the first object in the array
        var meanFreq = metaData.map(entry => entry.wfreq).filter(num => num != null);
        var realMean = meanFreq.reduce((a, b) => a + b, 0) / meanFreq.length
        console.log("The average freq is: " + realMean);

        var trace_3 = {
            type: 'indicator',
            mode: 'gauge+number+delta',
            domain: { 
                x: [0, 1], 
                y: [0, 1] 
            },
            value: results.wfreq,
            gauge: {
                axis: { range: [null, 10] },
                steps: [
                  { range: [0, 2], color: "red" },
                  { range: [2, 4], color: "orange" },
                  { range: [4, 6], color: "yellow" },
                  { range: [6, 8], color: "lightgreen" },
                  { range: [8, 10], color: "green" }
                ],
                bar: { color: "black" }
            },
            delta: { reference: realMean, increasing: { color: "green" } }
        }

        var layout_3 = { 
            title: {
                text: "Belly Button Washing Frequency",
                font: {
                    size: 24,
                    color: 'black'
                }
            },
            annotations: "Scrubs per week",
            paper_bgcolor: "#757171",
            font: {
                size: 20,
                font: {color: 'black'}
            }

        };

        Plotly.newPlot('gauge', [trace_3], layout_3, {responsive: true});

     })

    }

    optionChanged(940);