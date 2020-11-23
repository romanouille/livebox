#!/bin/sh
random=`</dev/urandom  tr -dc 0-9A-Za-z | head -c12`

rm /tmp/Asterisk_mail$random.txt
while read LINE; do
           echo ${LINE} >> /tmp/Asterisk_mail$random.txt
done

#get mailbox(to), msgfile, callerID(from)
sed -n 4p /tmp/Asterisk_mail$random.txt > /tmp/test$random.txt
awk -F"Subject:" '{print $NF}' /tmp/test$random.txt > /tmp/test2$random.txt
msgnum=$(awk -F"|" '{print $2}' /tmp/test2$random.txt)
mailbox=$(awk -F"|" '{print $1}' /tmp/test2$random.txt)

pbx_sendmailreq $mailbox $msgnum
rm /tmp/Asterisk_mail$random.txt 
rm /tmp/test2$random.txt
rm /tmp/test$random.txt

