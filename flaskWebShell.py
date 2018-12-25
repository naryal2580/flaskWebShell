#!/usr/bin/env python
# -*- coding: utf-8 -*-

from __future__ import print_function
from flask import Flask, render_template, request, send_from_directory
import subprocess
from os.path import join as osPathJoin
from os import setsid, killpg, getpgid
from signal import SIGTERM
# from flask import  session, redirect
# from flask_sslify import SSLify


webShell = Flask('webShell')
webShellRootPath = webShell.root_path


def execute(command):
    command = ' ' + command
    global proc
    proc = subprocess.Popen(
        command,
        shell=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        stdin=subprocess.PIPE,
        preexec_fn=setsid
        )
    stdOUT = proc.stdout.read() + proc.stderr.read()
    return stdOUT.strip()


@webShell.route('/', methods=['GET', 'EXEC', 'SIGTERM'])
def index():
    if request.method == 'GET':
        return render_template('index.html')
    elif request.method == 'EXEC':
        if len(request.form) == 1:
            if 'cmd' in request.form:
                command = request.form['cmd']
                output = execute(command)
                return output
        return 'Not a valid way of request.'
    elif request.method == 'SIGTERM':
        killpg(getpgid(proc.pid), SIGTERM)
        return 'PID: {}, killed via SIGTERM.'.format(proc.pid)
    else:
        return 'WTH!'


@webShell.route('/robots.txt')
def robots():
    return send_from_directory(osPathJoin(webShellRootPath, 'static'),
                               'robots.txt',
                               mimetype='text/plain')


@webShell.route('/favicon.ico')
def favicon():
    return send_from_directory(osPathJoin(webShellRootPath, 'static'),
                               'images/favicon.ico',
                               mimetype='image/vnd.microsoft.icon')


@webShell.after_request
def applyingSecurityHeaders(response):
    response.headers["Server"] = "Nick's Server!"
    # response.headers["Content-Type"] = "text/html; charset=utf-8"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["X-Content-Type-Options"] = "nosniff"
    # response.headers['Strict-Transport-Security'] = 'max-age=31536000'
    response.headers['Content-Security-Policy'] = "default-src 'self' "
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


if __name__ == '__main__':
    webShell.run(
                 host='0.0.0.0',
                 port=2580,
                 debug=True
                )
