<html>
<head>
    <!-- message to display once form is submitted -->
    <h1> Thank you for submitting your information. <h1>
</head>
<body>
<?php
    // Get form data and store in variables
    $fname = $_POST['fname'];
    $lname = $_POST['lname'];
    $email = $_POST['email'];
    $age = $_POST['age'];
    $gender = $_POST['gender'];
    $disabilityOption = $_POST['disabilityOption'];
    $glassesOption = $_POST['glassesOption'];
    $medicatedOption = $_POST['medicatedOption'];
 				
    // format data
    $data = "First Name: $fname\nLast Name: $lname\nEmail: $email\nage: $age\ngender: $gender\nDo you have a disability?: $disabilityOption\nAre you wearing glasses?: $glassesOption\nAre you currently medicated?: $medicatedOption\n\n";

    // open and write to file then close the file
    $file = fopen("participants.txt", "a") or die("Unable to open file"); // if file doesn't exist it will create one
    fwrite($file,$data);
    fclose($file);
?>
</body>
</html>
