<?php

# Parameters:
# - url: url to invoke
# - proxyHost: proxy host (optional)
# - proxyPort: proxy port (optional)

error_reporting(0);

function replace_cb ($matches) {
    return strtoupper($matches[0]);
}

function http_parse_headers($header) {
	$retVal = array();
	$fields = explode("\r\n", preg_replace('/\x0D\x0A[\x09\x20]+/', ' ', $header));
	foreach ($fields as $field) {
		if (preg_match('/([^:]+): (.+)/m', $field, $match)) {
            // $match[1] = preg_replace('/(?<=^|[\x09\x20\x2D])./e', 'strtoupper("\0")', strtolower(trim($match[1])));
			// preg_replace /e is removed in PHP5.5 and preg_replace is deprecated
            $match[1] = preg_replace_callback('/(?<=^|[\x09\x20\x2D])./', "replace_cb", strtolower(trim($match[1])));
			if (isset($retVal[$match[1]])) {
				$retVal[$match[1]] = array($retVal[$match[1]], $match[2]);
			} else {
				$retVal[$match[1]] = trim($match[2]);
			}
		}
	}
	return $retVal;
}

if (!function_exists("curl_init")) {
	header("HTTP/1.0 404 Curl undefined on Php server");
	echo "";
	exit();
}

if (!isset($_REQUEST["url"])) {
	echo "Missing mandatory parameter 'url'";
	exit ;
}

$url = $_REQUEST["url"];

$session = curl_init();
curl_setopt($session, CURLOPT_URL, $url);
curl_setopt($session, CURLOPT_VERBOSE, 1);
curl_setopt($session, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($session, CURLOPT_HEADER, 1);

if (isset($_REQUEST["proxyHost"])) {
	curl_setopt($session, CURLOPT_PROXY, $_REQUEST["proxyHost"]);
	curl_setopt($session, CURLOPT_PROXYPORT, $_REQUEST["proxyPort"]);
}

$body = file_get_contents('php://input');

$headers = array();
foreach (getallheaders() as $key => $value) {
	$lowkey = strtolower($key);
	if (($lowkey == "content-type") || ($lowkey == "content-length") || ($lowkey == "authorization") || ($lowkey == "x-context") || ($lowkey == "x-sah-request-type") || ($lowkey == "accept") || ($lowkey == "cookie")) {		
		$headers[] = $key . ": " . $value;
	}
	if($lowkey == "content-type") {
		$boundary = substr(strstr($value, "boundary="), 9);
	}
	if($lowkey == "x-context") {
		$xcontext = $value;
	}
}

curl_setopt($session, CURLOPT_HTTPHEADER, $headers);

if (!empty($body)) {
	curl_setopt($session, CURLOPT_POSTFIELDS, $body);
	curl_setopt($session, CURLOPT_POST, 1);
}
curl_setopt($session, CURLOPT_RETURNTRANSFER, 1);

$response = curl_exec($session);
$infoCode = curl_getinfo($session, CURLINFO_HTTP_CODE);
$infoSize = curl_getinfo($session, CURLINFO_HEADER_SIZE);
$header = http_parse_headers(substr($response, 0, $infoSize));
$result = substr($response, $infoSize);

header("Cache-Control: no-cache");
header("Pragma: no-cache");
header("Access-Control-Allow-Origin: *");

if(isset($header['Content-Type'])) {
  header("Content-Type: " . $header['Content-Type']);
}

if(isset($header['Content-Disposition'])) {
  header("Content-Disposition: " . $header['Content-Disposition']);
}

if(isset($header['Set-Cookie'])) {
	if(is_array($header['Set-Cookie'])) {
		for( $indSet = 0; $indSet <count($header['Set-Cookie']); $indSet++) {
			header("Set-Cookie: ".$header['Set-Cookie'][$indSet]);
		} 
	} else {
		header("Set-Cookie: ".$header['Set-Cookie']);
	}
}
if ($infoCode != 200) {
	if ($infoCode > 0) {
		header("HTTP/1.0 " . $infoCode . " " . curl_error($session) . " - " . $url);
	} else {
		header("HTTP/1.0 404 " . curl_error($session) . " - " . $url);
	}
} else if ($result == false) {
	header("HTTP/1.0 503 " . curl_error($session) . " - " . $url);
}

curl_close($session);

echo $result;
?>
