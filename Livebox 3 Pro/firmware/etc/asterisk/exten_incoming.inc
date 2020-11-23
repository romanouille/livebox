
[incoming_call]

exten => _[+*#0-9].,1,GotoIf($["${MACRO_EXTEN}"="${MAINTENANCE_EXTEN}"]?denied:authorized)
same => n(denied),Macro(playback,1,operation-denied)
same => n,Hangup()
same => n(authorized),GotoIf($["${DB(Trunck/status)}"="1"]?interface_UP:hangup)
same => n(interface_UP),Set(GROUP()=MaxSession)
same => n,NoOp(session = ${GROUP_COUNT(MaxSession)})
same => n,Set(is_incomingCall=1)
same => n,Set(CIDname_exter_call=${CALLERID(name)})
same => n,Set(CIDnum_exter_call=${CALLERID(num)})
same => n,GotoIf($[${GROUP_COUNT(MaxSession)}>${MAX_SESSIONS}]?hangup)
same => n,Set(from=${SIP_HEADER(FROM)})
same => n,GotoIf($[ $[${REGEX("Anonymous" ${from})}] | $[${REGEX("anonymous" ${from})}] ]?:next_test)
same => n,Set(CALLERID(name)=${DB(Incoming/Anonymous)})
same => n,Set(CALLERID(num)=${DB(Incoming/Anonymous)})
same => n(next_test),GotoIf($[${EXISTS(${DB(IncomingMap/${EXTEN})})}]?CALL_SDA:DEFAULT)
same => n(CALL_SDA),Macro(incoming_call,${DB(IncomingMap/${EXTEN})})
same => n(DEFAULT),GotoIf($[${EXISTS(${DB(IncomingMapTrunk/default)})}]?CALL_DEFAULT:hangup)
same => n(CALL_DEFAULT),Macro(incoming_call,${DB(IncomingMapTrunk/default)})
same => n(hangup),Hangup(19)



