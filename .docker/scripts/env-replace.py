# 
# Replaces #placeholder# values from the build step with values from the system environment
# System variables are set by Docker/kubernetes when deployed
# Filter: Only uses variables that start with 'pcs_' but removes this prefix when searching for replacement
#

import os
import sys
import glob

print('Start - Replacing placeholder variables')

keyVaultSecrets = []
for key in os.environ:
    if (key.startswith('pcs_')):
        keyVaultSecrets.append((key.replace('pcs_',''),os.environ.get(key)))

# Get all files
for filepath in glob.iglob('/usr/share/nginx/html/**/*.js', recursive=True):
    print("Looking for stuff to replace in: {filepath}".format(**vars()))
    s = ""
    with open(filepath) as file:
        s = file.read()
    for placeholderKey,value in keyVaultSecrets:
        print("Replacing: #{placeholderKey}# - {value}".format(**vars()))
        s = s.replace('#' + placeholderKey + '#', value)
    with open(filepath, "w") as file:
        file.write(s)

print('Done - Replacing placeholder variables')
