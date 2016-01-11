Premise
==================================================
This folder contains project backups before pregapp special email rule was introduced on the test server.

Quickforms and dependencies before this change were archived in this folder. The project files include:

pregapp.zip = Pregapp before the email notification feature was added.
pregappSME.zip = Pregapp rules engine codes before the changes was made
quickforms.zip = Quick forms application codes before the changes were addded
quickformsDAO.zip = Data Access Objects before the changes were addded

The war and jar file deployed on the server include on the 13th of July, 2015 include

quickforms.war
pregappSME.jar
qfdao-1.09.jar

executables and dependencies - New Changes
==================================================
After the changes were added to the projects, the codebase in github was updated. The current jar files running on the test server for the applications are kept in the "executables and dependencies" folder to ease their migration to the production server.

pregappSME.jar = Current pregapp rules engine
qfdao-1.10.jar = Current Data Access Objects
quickfoms.war = Quick forms applications with support for the pregapp email notification
send_email.vbs = The windows vbscript file used with windows task manager to trigger these emails nightly.
json-simple-1.1.1.jar, mail-1.4.1.jar and activation-1.1.1.jar - dependencies for the rules engine. ensure that these files are in tomcat bin.
