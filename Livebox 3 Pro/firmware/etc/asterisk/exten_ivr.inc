
[macro-IVR]
exten => s,1,GotoIf($["${DB(IVR/ToneEnable)}"="1"]?IVR_Actif:hangup)
same => n(IVR_Actif),Set(CDR(IVR_NUM)=${DB(IVR/Number})
same => n,Set(IVRCall=1)
same => n,Goto(IVR-MENU,s,1)
same => n(hangup),Hangup()

[IVR-MENU]

exten => s,1,Set(SIP_CODEC=g729)
exten => s,2,NoOp(${DB(IVR/Key_Service_0)})                                                               
exten => s,3,Answer()
exten => s,4,Set(RepeatCount=0)
exten => s,5,Background(/usr/lib/asterisk/customer/IVR/${DB(IVR/IvrWelcomeMsg)})

same => n,Set(RepeatCount=$[${RepeatCount} + 1])

same => n,WaitExten(${DB(IVR/WaitingDelay)})

same => n,GotoIf($[${RepeatCount} = ${DB(IVR/TryNumber)}]?TransferNumber:reTry)
same => n(reTry),Goto(IVR-MENU,s,5)
same => n(TransferNumber),Set(TransferNum=${DB(IVR/AlternativeShortNumber)})
same => n, GotoIf($["${EXISTS(${TransferNum})}"="1"]?IVR_CallTransfer:hangup)
same => n(IVR_CallTransfer),Set(IncomingCallsGeneralRinger=${IF($[ $["${DB(Trunk/GeneralRinger)}"="0"] | $["${is_incomingCall}"!="1"] ]?:&Local/000@GeneralRinger)})
same => n,Dial(SIP/${TransferNum}${IncomingCallsGeneralRinger},15,m(default))
same => n(hangup),Macro(playback,1,vm-goodbye)
same => n,Hangup()


exten => 0,1,Goto(${DB(IVR/Key_Service_0)},s,1)
same => n,Hangup()

exten => 1,1,Goto(${DB(IVR/Key_Service_1)},s,1)
same => n,Hangup()

exten => 2,1,Goto(${DB(IVR/Key_Service_2)},s,1)
same => n,Hangup()

exten => 3,1,Goto(${DB(IVR/Key_Service_3)},s,1)
same => n,Hangup()

exten => 4,1,Goto(${DB(IVR/Key_Service_4)},s,1)
same => n,Hangup()

exten => 5,1,Goto(${DB(IVR/Key_Service_5)},s,1)
same => n,Hangup()

exten => 6,1,Goto(${DB(IVR/Key_Service_6)},s,1)
same => n,Hangup()

exten => 7,1,Goto(${DB(IVR/Key_Service_7)},s,1)
same => n,Hangup()

exten => 8,1,Goto(${DB(IVR/Key_Service_8)},s,1)
same => n,Hangup()

exten => 9,1,Goto(${DB(IVR/Key_Service_9)},s,1)
same => n,Hangup()

exten => *,1,Goto(${DB(IVR/Key_Service_*)},s,1)
same => n,Hangup()

exten => #,1,Goto(${DB(IVR/Key_Service_#)},s,1)
same => n,Hangup()

[invalid-process]

exten => s,1,Macro(playback,1,vm-invalid_number)
same => n,Goto(IVR-MENU,s,4)
same => n,Hangup()

[repeat-process]

exten => s,1,Goto(IVR-MENU,s,4)
same => n,Hangup()

[dial-processKey_0]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_0)},1)

[dial-processKey_1]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_1)},1)

[dial-processKey_2]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_2)},1)

[dial-processKey_3]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_3)},1)

[dial-processKey_4]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_4)},1)

[dial-processKey_5]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_5)},1)

[dial-processKey_6]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_6)},1)

[dial-processKey_7]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_7)},1)

[dial-processKey_8]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_8)},1)

[dial-processKey_9]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_9)},1)

[dial-processKey_*]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_*)},1)

[dial-processKey_#]

exten => s,1,Goto(${DB(IVR/profileID)},${DB(IVR/ExtensionNumberKey_#)},1)

[diffusion-processKey_0]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_0)})
same => n,Hangup()

[diffusion-processKey_1]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_1)})
same => n,Hangup()

[diffusion-processKey_2]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_2)})
same => n,Hangup()

[diffusion-processKey_3]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_3)})
same => n,Hangup()

[diffusion-processKey_4]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_4)})
same => n,Hangup()

[diffusion-processKey_5]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_5)})
same => n,Hangup()

[diffusion-processKey_6]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_6)})
same => n,Hangup()

[diffusion-processKey_7]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_7)})
same => n,Hangup()

[diffusion-processKey_8]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_8)})
same => n,Hangup()

[diffusion-processKey_9]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_9)})
same => n,Hangup()

[diffusion-processKey_*]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_*)})
same => n,Hangup()

[diffusion-processKey_#]

exten => s,1,Macro(playback,1,/usr/lib/asterisk/customer/IVR/${DB(IVR/MessageInfoKey_#)})
same => n,Hangup()


