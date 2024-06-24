const expectedKey = "Hello123";
let isProcessing = false;
let scanner;

const reverseMapping = {
    'x': 'a', 'y': 'b', 'z': 'c', 'a': 'd', 'b': 'e',
    'c': 'f', 'd': 'g', 'e': 'h', 'f': 'i', 'g': 'j',
    'h': 'k', 'i': 'l', 'j': 'm', 'k': 'n', 'l': 'o',
    'm': 'p', 'n': 'q', 'o': 'r', 'p': 's', 'q': 't',
    'r': 'u', 's': 'v', 't': 'w', 'u': 'x', 'v': 'y',
    'w': 'z', 'X': 'A', 'Y': 'B', 'Z': 'C', 'A': 'D',
    'B': 'E', 'C': 'F', 'D': 'G', 'E': 'H', 'F': 'I',
    'G': 'J', 'H': 'K', 'I': 'L', 'J': 'M', 'K': 'N',
    'L': 'O', 'M': 'P', 'N': 'Q', 'O': 'R', 'P': 'S',
    'Q': 'T', 'R': 'U', 'S': 'V', 'T': 'W', 'U': 'X',
    'V': 'Y', 'W': 'Z', '9': '0', '8': '1', '7': '2',
    '6': '3', '5': '4', '4': '5', '3': '6', '2': '7',
    '1': '8', '0': '9'
};

let errorLogged = false;

function decodeData(encodedData) {
    let decodedData = '';
    for (let char of encodedData) {
        decodedData += reverseMapping[char] || char;
    }
    return decodedData;
}

function success(result) {
    if (isProcessing) return;
    isProcessing = true;

    let decodedData = decodeData(result);
    const dataArray = decodedData.split(',');
    const key = dataArray.pop();
    const studentData = dataArray.join(',');

    const teacherName = dataArray[3];
    const eventName = dataArray[4];
    const selectedEvent = document.getElementById("eventOptions").value;
    const selectedTeacher = document.getElementById("teacherOptions").value;

    if (teacherName !== selectedTeacher || eventName !== selectedEvent) {
        alert(`The scanned QR code pertains to the event '${eventName}' and teacher '${teacherName}', which does not correspond to the selected event '${selectedEvent}' and selected teacher '${selectedTeacher}'.`);
        isProcessing = false;
        return;
    }

    if (key === expectedKey) {
        const popupContent = document.querySelector('#popup-content');
        popupContent.innerHTML = '';
        const fields = ['Student Number', 'Full Name', 'Section', 'Teacher Name', 'Event', 'Amount', 'Payment Method', 'Payment App', 'Reference Number'];

        for (let i = 0; i < fields.length; i++) {
            const field = fields[i];
            const value = studentData.split(',')[i].trim();
            const pElement = document.createElement('p');
            pElement.innerHTML = `<strong>${field} : </strong>${value}`;
            popupContent.appendChild(pElement);
        }

        document.getElementById('popup').style.display = 'block';
        document.getElementById('reader').style.display = 'none';
        scanner.clear();
    } else {
        alert("Invalid QR code. Please scan a valid QR code.");
    }

    isProcessing = false;
}

function error(err) {
    if (!errorLogged) {
        console.error(err);
        errorLogged = true;
    }
}

function validateForm() {
    const eventOptions = document.getElementById("eventOptions");
    return eventOptions.value.trim() !== '';
}

function showEventSelectPopup() {
    document.getElementById("scannerEventSelectPopup").style.display = "block";
}

function closeEventPopup() {
    document.getElementById("scannerEventSelectPopup").style.display = "none";
    window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("scanBtn").addEventListener("click", showEventSelectPopup);
    document.getElementById("closeEventBtn").addEventListener("click", closeEventPopup);

    document.getElementById("submitButton").addEventListener("click", async function(event) {
        event.preventDefault();
        
        if (!validateForm()) {
            alert("Please select an event before proceeding.");
            return;
        }

        document.getElementById("scannerContainer").style.visibility = "visible";
        document.getElementById("scannerEventSelectPopup").style.display = "none"; 
        document.getElementById("scanBtn").style.display = "none";

        if (typeof Html5QrcodeScanner !== 'undefined') {
            scanner = new Html5QrcodeScanner('reader', {
                qrbox: {
                    width: 200,
                    height: 200
                },
                fps: 10,
            });

            scanner.render(success, error);
        } else {
            console.error("Html5QrcodeScanner is not defined");
        }
    });
});
