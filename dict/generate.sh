 echo "dict.words = [" > list.js
 cat /usr/share/dict/words.pre-dictionaries-common | sed 's/^/"/' | sed 's/$/",/' >> list.js
 echo "];" >> list.js