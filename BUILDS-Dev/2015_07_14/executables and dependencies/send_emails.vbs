Dim url
url="http://localhost:8000/pregapp/push_daily_emails.html?test_mode=true"

Dim IE
Set IE = WScript.CreateObject("InternetExplorer.Application")
    IE.Visible = true
    IE.Navigate url
    Wait IE, 15000
	IE.Stop
	IE.Quit

Sub Wait(IE, SleepInterval)
    Do
        WScript.Sleep SleepInterval
    Loop While IE.ReadyState < 4 And IE.Busy
End Sub
