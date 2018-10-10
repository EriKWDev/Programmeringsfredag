
string = "vsvsvvvvvv"

def flipAll (string_array):
    c = 0
    for i in range (0, len(string_array)-2):
        if (i == 0 and (string_array[0] + string_array[1] == "vs")):
            del string_array[0]
            del string_array[1]
            string_array.insert(0, "v")
            string_array.insert(0, "s")

            print (" HEJ " + "".join (string_array))

            c += 1
        elif (string_array[i] + string_array[i+1] + string_array[i+2] == "vsv"):
            del string_array[i+2]
            del string_array[i+1]
            string_array.insert(0, "s")
            string_array.insert(0, "v")

            print (" DEJ " + "".join (string_array))

            c += 1

    for i in range (0, len(string_array)-1):
        if (string_array[i] + string_array[i+1] == "ss"):
            del string_array[i+1]
            del string_array[i]
            string_array.append ("v")
            string_array.append ("v")

            print (" NEJ " + "".join (string_array))

            c += 1

    print (c)
    return "".join(string_array)

def flip (s):
    a = ""
    for i in range(1, len(s)+1):
        a += s[len(s)-i]
    return a

print flipAll (list (string))
print flipAll (list (flip (string)))
