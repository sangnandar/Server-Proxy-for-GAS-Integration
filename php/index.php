<?php
  $DEBUG = true; // Set to false in production
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Embed Google Sheets</title>
  <link rel="stylesheet" href="gsheets.css<?= $DEBUG ? '?v=' . time() : '' ?>">
  <script src="gsheets.js<?= $DEBUG ? '?v=' . time() : '' ?>"></script>
</head>
<body>

<?php

/**
 * Convert date "2025-04-24" to Catalan format like "24 d'abril de 2025".
 * 
 * @param date $date Date in YYYY-MM-DD format.
 * @return string Long date like "24 d'abril de 2025".
 */
function longDate($date)
{
  $datetime = new DateTime($date);

  $formatter = new IntlDateFormatter(
    'ca_ES',
    IntlDateFormatter::LONG,
    IntlDateFormatter::NONE,
    null,
    IntlDateFormatter::GREGORIAN,
    "d MMMM 'de' yyyy"
  );

  $formatted = $formatter->format($datetime);

  // Apply Catalan contraction: "de abril" → "d'abril" (if month starts with a vowel)
  $formatted = preg_replace("/de ([aeiouàèéíòóú])/iu", "d'\\1", $formatted);

  return $formatted;
}

// dummy data
$theatres = [
  [
    'name' => 'Antígona de Sòfocles',
    'date' => '2025-03-23',
    'time' => '10:30',
    'place' => 'l\'Hospitalet de Llobregat'
  ],
  [
    'name' => 'Mostellaria de Plaute',
    'date' => '2025-04-24',
    'time' => '12:30',
    'place' => 'l\'Hospitalet de Llobregat'
  ],
  [
    'name' => 'Antígona de Sòfocles',
    'date' => '2025-05-25',
    'time' => '10:30',
    'place' => 'l\'Hospitalet de Llobregat'
  ]
];

$html = '';

foreach ($theatres as $index => $theatre) {
  extract($theatre);

  $tableId = "table-$index";

  $html .= "
    <div>
      <h2>$name</h2>
      <p>" . longDate($date) . ", a les {$time}h a $place</p>
      <div class='table-container'>
        <table id='$tableId' class='gsheets-table'>
          <thead></thead>
          <tbody></tbody>
          <tfoot></tfoot>
        </table>
      </div>
      <script>
        fetchData(
          " . json_encode($name) . ",
          " . json_encode($date) . ",
          " . json_encode($time) . ",
          " . json_encode($place) . "
          ).then(data => drawTable(data, '$tableId'));
      </script>
    </div>
  ";
}

echo $html;

?>

</body>
</html>
