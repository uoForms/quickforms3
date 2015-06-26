<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Default.aspx.cs" Inherits="Palis3._Default" ValidateRequest="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<html>
    <script src="js/jquery-1.7.1.min.js"></script>
    <script src ="js/quickforms.js"></script>
    <script type="text/javascript">
        var username ='admin';
        setCookie('username',username,1);
        
        window.location ="education.html";

    </script>
	Redirecting...<br />
	If waiting for 20 seconds click <a href="education.html">here</a>
</html>
