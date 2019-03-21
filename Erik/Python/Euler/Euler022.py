
#Answer: 871198282

import string

textFile = open ("Euler022.txt")
lines = textFile.read ().split (',')
lines.sort ()

def NameToNumber (name) :
    n = 0
    for c in name.lower ().replace('\n', '') :
        n += string.lowercase.index (c) + 1
    n *= lines.index (name) + 1
    print name, n
    return n

def TotalOfAllNames () :
    n = 0
    for name in lines :
        n += NameToNumber (name)
    return n

n = TotalOfAllNames ()
print "Total :", n
