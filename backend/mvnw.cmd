@echo off
@setlocal

set "DIR=%~dp0"
set "DIR=%DIR:~0,-1%"
"%JAVA_HOME%\bin\java.exe" -Dmaven.multiModuleProjectDirectory="%DIR%" -classpath "%DIR%\.mvn\wrapper\maven-wrapper.jar" org.apache.maven.wrapper.MavenWrapperMain %*

@endlocal & exit /B %ERRORLEVEL%
