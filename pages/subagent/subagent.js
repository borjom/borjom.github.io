function onXmlUploaded() {
	const tableBody = document.getElementById("tableBody");
	while (tableBody.firstChild) {
		tableBody.removeChild(tableBody.firstChild);
	}

	const fileReader = new FileReader();
	fileReader.onload=function() {
		parseXmlText(fileReader.result);
	}
	fileReader.readAsText(document.getElementById('inputGroupFile').files[0]);	
}

function parseXmlText(text) {
	const parser = new DOMParser();
	const xmlDoc = parser.parseFromString(text.toLowerCase().replaceAll("cdata","CDATA"),"text/xml");
	const subagents = xmlDoc.getElementsByTagName("subagent");

	const tableBody = document.getElementById("tableBody");
	var subagentsArray = [];


	for (let subagent of subagents) {
		const email = getTagValue("email", subagent);
		const phone = getTagValue("phone", subagent);
		const firstName = capitalizeFirstLetter(getTagValue("firstname", subagent));
		const lastName = capitalizeFirstLetter(getTagValue("lastname", subagent));

		subagentsArray.push({
			"email" : email,
			"phone" : phone,
			"firstName" : firstName,
			"lastName" : lastName
		});
	}

	subagentsArray = subagentsArray.reduce((unique, o) => {
		if(!unique.some(obj => 
			obj.email === o.email
			)
		) {
			unique.push(o);
		}
		return unique;
	},[]);

	for (let subagent of subagentsArray) {
		const row = tableBody.insertRow();

		const emailCell = row.insertCell();
		emailCell.appendChild(document.createTextNode(subagent.email));

		const phoneCell = row.insertCell();
		phoneCell.appendChild(document.createTextNode(subagent.phone));

		const firstNameCell = row.insertCell();
		firstNameCell.appendChild(document.createTextNode(subagent.firstName));

		const lastNameCell = row.insertCell();
		lastNameCell.appendChild(document.createTextNode(subagent.lastName));
	}

	addDownloadCSVButton(subagentsArray)
}

function addDownloadCSVButton(subagents) {
	let csvContent = "data:text/csv;charset=utf-8," + "\r\n";


	subagents.forEach(function(subagent) {
	    let row = subagent.email + "," + subagent.phone + "," + subagent.firstName + "," + subagent.lastName
	    csvContent += row + "\r\n";
	});


	const downloadCSVButton = document. getElementById("downloadCSV");
	downloadCSVButton.style.visibility = 'visible';

	downloadCSVButton.addEventListener("click", function(){
	    download("export.csv", csvContent);
	}, false);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function getTagValue(tagName, subagent) {
	const element = subagent.getElementsByTagName(tagName)[0]
	var result
	if (element != null) {
		result = element.textContent;
	} else {
		result = "";
	}
	return result;
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}