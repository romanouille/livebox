
[keypad_CF]

exten => _*20,1,Macro(DesableAll_CF,${CALLERID(num)})  

exten => _*21*x.,1,Macro(CF_noResponse,${EXTEN:4},${CALLERID(num)})
exten => _*21*0,1,Macro(Desactv_noResponse,${CALLERID(num)})
exten => _*21,1,Macro(React_noResponse,${CALLERID(num)})
exten => _**21,1,Macro(Query_noResponse,${CALLERID(num)}) 

exten => _*22*x.,1,Macro(CF_onBusy,${EXTEN:4},${CALLERID(num)})
exten => _*22*0,1,Macro(Desactv_Busy,${CALLERID(num)})
exten => _*22,1,Macro(React_onBusy,${CALLERID(num)}) 
exten => _**22,1,Macro(Query_onBusy,${CALLERID(num)}) 

exten => _*23*x.,1,Macro(CF_noResponseOrBusy,${EXTEN:4},${CALLERID(num)})
exten => _*23*0,1,Macro(Desactv_noResponseOrBusy,${CALLERID(num)})
exten => _*23,1,Macro(React_noResponseOrBusy,${CALLERID(num)}) 
exten => _**23,1,Macro(Query_noResponseOrBusy,${CALLERID(num)})

exten => _*24*x.,1,Macro(CF_disconected,${EXTEN:4},${CALLERID(num)})
exten => _*24*0,1,Macro(Desactv_disconected,${CALLERID(num)})
exten => _*24,1,Macro(React_disconected,${CALLERID(num)}) 
exten => _**24,1,Macro(Query_disconected,${CALLERID(num)}) 

exten => _*25*x.,1,Macro(CF_disconectedorNoResponse,${EXTEN:4},${CALLERID(num)}) 
exten => _*25*0,1,Macro(Desactv_disconectedorNoResponse,${CALLERID(num)})
exten => _*25,1,Macro(React_disconectedorNoResponse,${CALLERID(num)}) 
exten => _**25,1,Macro(Query_disconectedorNoResponse,${CALLERID(num)}) 

exten => _*26*x.,1,Macro(CF_disconectedorBusy,${EXTEN:4},${CALLERID(num)}) 
exten => _*26*0,1,Macro(Desactv_disconectedorBusy,${CALLERID(num)})
exten => _*26,1,Macro(React_disconectedorBusy,${CALLERID(num)}) 
exten => _**26,1,Macro(Query_disconectedorBusy,${CALLERID(num)}) 

exten => _*27*x.,1,Macro(CF_disconectedorBusyorNoResponse,${EXTEN:4},${CALLERID(num)})
exten => _*27*0,1,Macro(Desactv_disconectedorBusyorNoResponse,${CALLERID(num)})
exten => _*27,1,Macro(React_disconectedorBusyorNoResponse,${CALLERID(num)}) 
exten => _**27,1,Macro(Query_disconectedorBusyorNoResponse,${CALLERID(num)}) 

exten => _*28*x.,1,Macro(CF_unconditional,${EXTEN:4},${CALLERID(num)}) 
exten => _*28*0,1,Macro(Desactv_unconditional,${CALLERID(num)})
exten => _*28,1,Macro(React_unconditional,${CALLERID(num)}) 
exten => _**28,1,Macro(Query_unconditional,${CALLERID(num)}) 

exten => _*29*1,1,Macro(CF_EnableDND,${EXTEN:4},${CALLERID(num)}) 
exten => _*29*0,1,Macro(CF_DisableDND,${EXTEN:4},${CALLERID(num)})
exten => _**29,1,Macro(Query_DND,${CALLERID(num)})

exten => *789*1,1,Macro(CF_EnableProtection)
exten => *789*0,1,Macro(CF_DisableProtection)
exten => *789*,1,Macro(CF_ToggleProtection)
exten => **789,1,Macro(CF_QueryProtection)

exten => *89*1,1,Macro(CF_EnableProtection)
exten => *89*0,1,Macro(CF_DisableProtection)
exten => *89*,1,Macro(CF_ToggleProtection)
exten => **89,1,Macro(CF_QueryProtection)

[macro-Verify_Profile]       
exten => s,1,NoOp( Arg1=>${ARG1} )
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Exten)},${ARG2},1,Macro,Permit)}"="0" ]?:AUTH)
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Exten)},${ARG2},1,Macro,Denied)}"="0" ]?AUTH:)
same => n,NoOp(YOU ARE NOT AUTHORIZED ... :( )
same => n,Macro(Not_Auth)
same => n(AUTH),NoOp(YOU ARE AUTHORIZED ... :) )

[macro-Verify_Profile_Before_Call]       
exten => s,1,NoOp( Arg1=>${ARG1} *** Arg3=>${ARG3} )
same => n,GotoIf($["${ARG3}"="1"]?direct_call:forwarded_call)
same => n(direct_call),GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/DC_ProfileID_Exten)},${ARG2},1,Macro,Permit)}"="0" ]?:AUTH)
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/DC_ProfileID_Exten)},${ARG2},1,Macro,Denied)}"="0" ]?AUTH:)
same => n,NoOp(YOU ARE NOT AUTHORIZED FOR THIS DIRECT CALL... :( )
same => n,Macro(Denied)
same => n(forwarded_call),GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Exten)},${ARG2},1,Macro,Permit)}"="0" ]?:AUTH)
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Exten)},${ARG2},1,Macro,Denied)}"="0" ]?AUTH:)
same => n,NoOp(YOU ARE NOT AUTHORIZED FOR THIS CALLFORWARDED CALL... :( )
same => n,Macro(voicemail,${ARG1})
same => n(AUTH),NoOp(YOU ARE AUTHORIZED ... :) )

[macro-CF_noResponse]    
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})   
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerNumber ${numero})
same => n,Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_noResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,Macro(playback,3,forwarded-by,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_noResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)})
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_noResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?TestEnable:notExist)
same => n(TestEnable),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)})
same => n,Hangup()
same => n(Desactive),Macro(playback,3,forwarded-by,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup() 

[macro-CF_onBusy]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyNumber ${numero})
same => n,Macro(playback,4,forwarded-by,on-busy,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup() 

[macro-Desactv_Busy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 0)
same => n,Macro(playback,3,forwarded-by,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_onBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,Macro(playback,4,forwarded-by,on-busy,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)})
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_onBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?TestEnable:notExist)
same => n(TestEnable),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,4,forwarded-by,on-busy,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)})
same => n,Hangup()
same => n(Desactive),Macro(playback,3,forwarded-by,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_noResponseOrBusy]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerNumber ${numero})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyNumber ${numero})
same => n,Macro(playback,6,forwarded-by,on-no-answer,and,on-busy,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_noResponseOrBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 0)
same => n,Macro(playback,5,forwarded-by,on-no-answer,and,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()


[macro-React_noResponseOrBusy] 
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,Macro(playback,5,forwarded-by,on-no-answer,and,on-busy,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)})
same => n(noNum),Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_noResponseOrBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?TestEnable1:notExist)
same => n(TestEnable1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyEnable)}"="1"]?TestEnable2:Desactive)
same => n(TestEnable2),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,5,forwarded-by,on-no-answer,and,on-busy,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)})
same => n(noNum),Hangup()
same => n(Desactive),Macro(playback,5,forwarded-by,on-no-answer,and,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_disconected]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedNumber ${numero})
same => n,Macro(playback,4,forwarded-by,on-disconnected,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_disconected]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 0)
same => n,Macro(playback,3,forwarded-by,on-disconnected,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_disconected]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,Macro(playback,4,forwarded-by,on-disconnected,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_disconected]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?TestEnable:notExist)
same => n(TestEnable),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,4,forwarded-by,on-disconnected,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n,Hangup()
same => n(Desactive),Macro(playback,3,forwarded-by,on-disconnected,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_disconectedorNoResponse]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedNumber ${numero})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerNumber ${numero})
same => n,Macro(playback,6,forwarded-by,on-disconnected,and,on-no-answer,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_disconectedorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?:notExist)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,Macro(playback,5,forwarded-by,on-disconnected,and,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()


[macro-React_disconectedorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,Macro(playback,5,forwarded-by,on-disconnected,and,on-no-answer,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_disconectedorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?TestEnable1:notExist)
same => n(TestEnable1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedEnable)}"="1"]?TestEnable2:Desactive)
same => n(TestEnable2),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,5,forwarded-by,on-disconnected,and,on-no-answer,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(Desactive),Macro(playback,5,forwarded-by,on-disconnected,and,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_disconectedorBusy]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedNumber ${numero})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyNumber ${numero})
same => n,Macro(playback,6,forwarded-by,on-disconnected,and,on-busy,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_disconectedorBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?:notExist)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 0)
same => n,Macro(playback,5,forwarded-by,on-disconnected,and,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_disconectedorBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,Macro(playback,5,forwarded-by,on-disconnected,and,on-busy,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_disconectedorBusy]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?TestEnable1:notExist)
same => n(TestEnable1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedEnable)}"="1"]?TestEnable2:Desactive)
same => n(TestEnable2),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,5,forwarded-by,on-disconnected,and,on-busy,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(Desactive),Macro(playback,5,forwarded-by,on-disconnected,and,on-busy,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_disconectedorBusyorNoResponse]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedNumber ${numero})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyNumber ${numero})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerNumber ${numero})
same => n,Macro(playback,8,forwarded-by,on-disconnected,and,on-busy,and,on-no-answer,activated,to)
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_disconectedorBusyorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?:notExist)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?:notExist)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,Macro(playback,7,forwarded-by,on-disconnected,and,on-busy,and,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_disconectedorBusyorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?next1:notExist)
same => n(next1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,Macro(playback,7,forwarded-by,on-disconnected,and,on-busy,and,on-no-answer,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"]?:noNum)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_disconectedorBusyorNoResponse]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"!=""]?next:notExist)
same => n(next),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"!=""]?next1:notExist)
same => n(next1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"!=""]?TestEnable1:notExist)
same => n(TestEnable1),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedEnable)}"="1"]?TestEnable2:Desactive)
same => n(TestEnable2),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnBusyEnable)}"="1"]?TestEnable3:Desactive)
same => n(TestEnable3),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,7,forwarded-by,on-disconnected,and,on-busy,and,on-no-answer,activated)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnBusyNumber)}"]?:noNum)
same => n,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)}"="${DB(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)}"]?:noNum)
same => n,Macro(playback,1,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n(noNum),Hangup()
same => n(Desactive),Macro(playback,7,forwarded-by,on-disconnected,and,on-busy,and,on-no-answer,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-GetCallForwardedNumber]
exten => s,1,NoOp(*** arg1 => ${ARG1} *** arg2 => ${ARG2} *** ${DB(${ARG2}/LIST_PERSO_SHORT-NUM)})
same => n,GotoIf($["${EXISTS(${DB(${ARG1}/CONTACT_EXT-SHORT-NUMBER)})}"="1"]?:CheckPersonalNumber)
same => n,Set(CallForwardedNum=${DB(${ARG1}/CONTACT_EXT-SHORT-NUMBER)})
same => n,Goto(end)
same => n(CheckPersonalNumber),GotoIf($[ "${REGEX(":${ARG1}:" ${DB(${ARG2}/LIST_PERSO_SHORT-NUM)})}"="1" ]?Exist:notExist)
same => n(Exist),Set(count_contact=${FIELDQTY(DB(${ARG2}/LIST_PERSO_SHORT-NUM),#)})
same => n,Set(count=1)
same => n,Set(last_count=$[${count_contact} - 1])
same => n,While($[${count} < ${last_count}]
same => n,Set(one_contact=${CUT(DB(${ARG2}/LIST_PERSO_SHORT-NUM),#,$[${count}+1])})
same => n,NoOp(one contact : ${One_Contact})
same => n,GotoIf($[ "${REGEX("${ARG1}" ${One_Contact})}"="1" ]?:Next_Contact)
same => n,Set(Number_To_CallForward=${CUT(One_Contact,:,3)})
same => n,NoOp(#${Number_To_CallForward}#)
same => n,ExitWhile() 
same => n(Next_Contact),Set(count=$[${count} + 1])
same => n,EndWhile()
same => n,Set(CallForwardedNum=${Number_To_CallForward})
same => n,Goto(end)
same => n(notExist),Set(CallForwardedNum=${ARG1})
same => n(end), NoOp(*** CallForwardedNum = ${CallForwardedNum} ***)

[macro-CF_unconditional]
exten => s,1,Macro(GetCallForwardedNumber,${ARG1},${ARG2})
same => n,Macro(Verify_Profile,${ARG2},${CallForwardedNum})
same => n,Set(numero=${ARG1})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardUnconditionalEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardUnconditionalNumber ${numero})
same => n,Macro(playback,4,forwarded-by,immediate,activated,to)                 
same => n,Saydigits(${MACRO_EXTEN:4})
same => n,Hangup()

[macro-Desactv_unconditional]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)}"!=""]?:notExist)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardUnconditionalEnable 0)
same => n,Macro(playback,3,forwarded-by,immediate,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-React_unconditional]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)}"!=""]?:notExist)
same => n,Macro(GetCallForwardedNumber,${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)},${ARG1})
same => n,Macro(Verify_Profile,${ARG1},${CallForwardedNum})
same => n(Exist),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardUnconditionalEnable 1)
same => n,Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)}) 
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-Query_unconditional]
exten => s,1,GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)}"!=""]?TestEnable:notExist)
same => n(TestEnable),GotoIf($["${DB(Call_Forward/${ARG1}/CallForwardUnconditionalEnable)}"="1"]?Active:Desactive)
same => n(Active),Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)}) 
same => n,Hangup()
same => n(Desactive),Macro(playback,3,forwarded-by,immediate,deactivated)
same => n,Hangup()
same => n(notExist),Macro(playback,1,no-recorder-number)
same => n,Hangup()

[macro-CF_EnableDND] 
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/DoNotDisturbEnable 1)
same => n,Macro(playback,2,do-not-disturb-mode,activated)
same => n,Hangup() 

[macro-CF_DisableDND]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/DoNotDisturbEnable 0)
same => n,Macro(playback,2,do-not-disturb-mode,deactivated)
same => n,Hangup() 

[macro-Query_DND]
exten => s,1,GotoIf($[${DB(Call_Forward/${CALLERID(num)}/DoNotDisturbEnable)}=1]?Exist:NotExist)
same => n(Exist),Macro(playback,2,do-not-disturb-mode,activated)
same => n,Hangup()
same => n(NotExist),Macro(playback,2,do-not-disturb-mode,deactivated)
same => n,Hangup() 


[macro-CF_EnableProtection] 
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardProtection 1)
same => n,Macro(playback,1,deny-cf)
same => n,Hangup()

[macro-CF_DisableProtection] 
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardProtection 0)
same => n,Macro(playback,1,accept-cf)
same => n,Hangup()

[macro-CF_ToggleProtection] 
exten => s,1,GotoIf($["${DB(Call_Forward/${CALLERID(num)}/CallForwardProtection)}"="0"]?activate-CFP)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardProtection 0)
same => n,Macro(playback,1,accept-cf)
same => n,Hangup()
same => n(activate-CFP),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardProtection 1)
same => n,Macro(playback,1,deny-cf)
same => n,Hangup()

[macro-CF_QueryProtection] 
exten => s,1,GotoIf($["${DB(Call_Forward/${CALLERID(num)}/CallForwardProtection)}"="1"]?refuse-CF)
same => n,Macro(playback,1,accept-cf)
same => n,Hangup()
same => n(refuse-CF),Macro(playback,1,deny-cf)
same => n,Hangup()
                                                   
[macro-playback]                                                           
exten  => s,1,Set(SIP_CODEC=g729)                                                                 
same => n,Answer()                                                                                      
same => n,Set(i=2)                                                                                      
same => n,Set(max=$[${ARG1} + ${i}])                                                            
same => n(begin),GotoIf($[${i} = ${max}]?close:play)                             
same => n(play),Playback(${ARG${i}})                                    
same => n,Set(i=$[${i} + 1])                                                                        
same => n,GoTo(begin)                                                                       
same => n(close),NoOp()      

[macro-DesableAll_CF]

exten => s,1,Macro(UserEvent_DisableAllCF)
same => n,Macro(playback,1,cancel-all-forward)
same => n,Hangup()

[macro-UserEvent_DisableAllCF]

exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnBusyEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardUnconditionalEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/DoNotDisturbEnable 0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallForwardOnDisconnectedEnable 0)

[keypad_queue]

exten => *31,1,Set(list_group=${DB(list/groups)})
same => n,Set(count_group=${FIELDQTY(list_group,#)})
same => n,Set(i=1)
same => n,While($[${i} < ${count_group}])
same => n,Set(group=${CUT(list_group,\#,${i})})
same => n,GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${group}/activated)} )}?:TEST)
same => n,Set(exist_member=1)
same => n,Goto(NEXT_ONE)
same => n(TEST),GotoIf($[${REGEX("${CALLERID(num)}"  ${DB(group/${group}/deactivated)} )}]?UNPAUSE:NEXT_ONE)
same => n(UNPAUSE),Set(exist_member=1)
same => n(NEXT_ONE),Set(i=$[${i} + 1])
same => n,EndWhile()
same => n,GotoIf($[${EXISTS(${exist_member})}]?FOUND:NOTFOUND)
same => n(FOUND),Macro(playback,1,huntgroup-all-in)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group/GroupExtensions/GroupExtension[ExtensionNumber='${CALLERID(num)}']/Enable true)
same => n,Hangup()
same => n(NOTFOUND),Macro(NotFound)


exten => *30,1,Set(list_group=${DB(list/groups)})
same => n,Set(member_deactivated=0)
same => n,Set(member_activated=0)
same => n,Set(count_group=${FIELDQTY(list_group,#)})
same => n,Set(i=1)
same => n,While($[${i} < ${count_group}])
same => n,Set(group=${CUT(list_group,\#,${i})})
same => n,GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${group}/deactivated)} )}?:TEST_1)
same => n,Set(member_deactivated=1)
same => n,Goto(NEXT_ONE)
same => n(TEST_1),GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${group}/activated)} )}?:NEXT_ONE)
same => n,Set(list_activated=${list_activated}#${group})
same => n,Goto(TEST_2)
same => n(TEST_2),NoOp(${FIELDQTY(DB(group/${group}/activated),&)})
same => n,GotoIf($[${FIELDQTY(DB(group/${group}/activated),&)} = 1 ]?NOTFOUND:)
same => n,Set(member_activated=1)
same => n(NEXT_ONE),Set(i=$[${i} + 1])
same => n,EndWhile()
same => n,GotoIf($[ $["${member_activated}"="0"] & $["${member_deactivated}"="1"]]?FOUND)
same => n,GotoIf($[ $["${member_activated}"="0"] & $["${member_deactivated}"="0"]]?NOTFOUND)
same => n,Set(i=1)
same => n,While($[${i} < ${count_group}])
same => n,Set(group=${CUT(list_group,\#,${i})})
same => n,GotoIf(${REGEX("${group}"  ${list_activated} )}?:NEXT)
same => n(NEXT),Set(i=$[${i} + 1])
same => n,EndWhile()
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group/GroupExtensions/GroupExtension[ExtensionNumber='${CALLERID(num)}']/Enable false)
same => n(FOUND),Macro(playback,1,huntgroup-all-out)
same => n,Hangup()
same => n(NOTFOUND),Macro(NotFound)

exten => _*31*XXX,1,Set(list_group=${DB(list/groups)})
same => n,GotoIf(${REGEX("${EXTEN:4:3}" ${list_group})}?TEST_1:NOTFOUND)
same => n(TEST_1),GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${EXTEN:4:3}/activated)} )}?FOUND:TEST_2)
same => n(TEST_2),GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${EXTEN:4:3}/deactivated)} )}?UNPAUSE:NOTFOUND)
same => n(UNPAUSE),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${EXTEN:4:3}']/GroupExtensions/GroupExtension[ExtensionNumber='${CALLERID(num)}']/Enable true)
same => n(FOUND),Macro(playback,1,hunrgroup-in)
same => n,Saydigits(${EXTEN:4:3})
same => n,Hangup()
same => n(NOTFOUND),Macro(NotFound)

exten => _*30*XXX,1,Set(list_group=${DB(list/groups)})
same => n,GotoIf(${REGEX("${EXTEN:4:3}" ${list_group})}?TEST_1:NOTFOUND)
same => n(TEST_1),GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${EXTEN:4:3}/deactivated)} )}?FOUND:TEST_2)
same => n(TEST_2),GotoIf(${REGEX("${CALLERID(num)}"  ${DB(group/${EXTEN:4:3}/activated)} )}?TEST_3:NOTFOUND)
same => n(TEST_3),GotoIf($["${FIELDQTY(DB(group/${EXTEN:4:3}/activated),&)}"="1"]?NOTFOUND:PAUSE)
same => n(PAUSE),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${EXTEN:4:3}']/GroupExtensions/GroupExtension[ExtensionNumber='${CALLERID(num)}']/Enable false)
same => n(FOUND),Macro(playback,1,huntgroup-out)
same => n,Saydigits(${EXTEN:4:3})
same => n,Hangup()
same => n(NOTFOUND),Macro(NotFound)

[keypad_CF_queue]
exten => _*321*XXX*.,1,Macro(CFNR_GActivation,${CALLERID(num)},${EXTEN:5:3},${EXTEN:9})
exten => _*321*XXX*0,1,Macro(CFNR_GDeactivation,${CALLERID(num)},${EXTEN:5:3},${EXTEN:9})
exten => _*321*XXX,1,Macro(CFNR_GReactivation,${CALLERID(num)},${EXTEN:5:3})
exten => _*321*XXX*,1,Macro(CFNR_GToggle,${CALLERID(num)},${EXTEN:5:3})
exten => _**321*XXX,1,Macro(CFNR_GQuery,${CALLERID(num)},${EXTEN:6:3})

exten => _*328*XXX*.,1,Macro(CFU_GActivation,${CALLERID(num)},${EXTEN:5:3},${EXTEN:9})
exten => _*328*XXX*0,1,Macro(CFU_GDeactivation,${CALLERID(num)},${EXTEN:5:3},${EXTEN:9})
exten => _*328*XXX,1,Macro(CFU_GReactivation,${CALLERID(num)},${EXTEN:5:3})
exten => _*328*XXX*,1,Macro(CFU_GToggle,${CALLERID(num)},${EXTEN:5:3})
exten => _**328*XXX,1,Macro(CFU_GQuery,${CALLERID(num)},${EXTEN:6:3})

exten => _*329*XXX*1,1,Macro(DND_GActivation,${CALLERID(num)},${EXTEN:5:3})
exten => _*329*XXX*0,1,Macro(DND_GDeactivation,${CALLERID(num)},${EXTEN:5:3})
exten => _*329*XXX*,1,Macro(DND_GToggle,${CALLERID(num)},${EXTEN:5:3})
exten => _**329*XXX,1,Macro(DND_GQuery,${CALLERID(num)},${EXTEN:6:3})

[macro-Verify_Profile_Group]       
exten => s,1,NoOp( Arg1=>${ARG1} #${ARG2}#)
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Group)},${ARG2},1,Macro,Permit)}"="0" ]?:AUTH)
same => n,GotoIf($[ "${VALID_EXTENSION(${DB(${ARG1}/CF_ProfileID_Group)},${ARG2},1,Macro,Denied)}"="0" ]?AUTH:)
same => n,NoOp(YOU ARE NOT AUTHORIZED ... :( )
same => n,Macro(Not_Auth)
same => n(AUTH),NoOp(YOU ARE AUTHORIZED ... :) )

[macro-CFNR_GActivation]
exten => s,1,Macro(Verify_Profile_Group,${ARG2},${ARG3})
same => n,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerNumber ${ARG3})
same => n,Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${ARG3})
same => n(hangup),Hangup()

[macro-CFNR_GDeactivation]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})} ]?:no_recorder)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,Macro(playback,3,forwarded-by,on-no-answer,deactivated)
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFNR_GReactivation]
exten => s,1,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})} ]?:no_recorder)
same => n,Macro(Verify_Profile_Group,${ARG2},${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})
same => n,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerEnable)}" = "1" ] ]?prompt:activate)
same => n(activate),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n(prompt),Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFNR_GToggle]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})} ]?:no_recorder)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerEnable)}" = "1" ] ]?:activate)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerEnable 0)
same => n,Macro(playback,3,forwarded-by,on-no-answer,deactivated)
same => n,hangup()
same => n(activate),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardOnNoAnswerEnable 1)
same => n,Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFNR_GQuery]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})} ]?:no_recorder)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerEnable)}" = "1" ] ]?:deactivated)
same => n,Macro(playback,4,forwarded-by,on-no-answer,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardOnNoAnswerNumber)})
same => n,hangup()
same => n(deactivated),Macro(playback,3,forwarded-by,on-no-answer,deactivated)
same => n,hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFU_GActivation]
exten => s,1,Macro(Verify_Profile_Group,${ARG2},${ARG3})
same => n,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalEnable 1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalNumber ${ARG3})
same => n,Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${ARG3})
same => n(hangup),Hangup()

[macro-CFU_GDeactivation]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})} ]?:no_recorder)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalEnable 0)
same => n,Macro(playback,3,forwarded-by,immediate,deactivated)
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFU_GReactivation]
exten => s,1,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})} ]?:no_recorder)
same => n,Macro(Verify_Profile_Group,${ARG2},${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})
same => n,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardUnconditionalEnable)}" = "1" ] ]?prompt:activate)
same => n(activate),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalEnable 1)
same => n(prompt),Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFU_GToggle]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})} ]?:no_recorder)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardUnconditionalEnable)}" = "1" ] ]?:activate)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalEnable 0)
same => n,Macro(playback,3,forwarded-by,immediate,deactivated)
same => n,hangup()
same => n(activate),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/CallForwardUnconditionalEnable 1)
same => n,Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})
same => n,Hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()

[macro-CFU_GQuery]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ ${EXISTS(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})} ]?:no_recorder)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/CallForwardUnconditionalEnable)}" = "1" ] ]?:deactivated)
same => n,Macro(playback,4,forwarded-by,immediate,activated,to)
same => n,Saydigits(${DB(Call_Forward/${ARG2}/CallForwardUnconditionalNumber)})
same => n,hangup()
same => n(deactivated),Macro(playback,3,forwarded-by,immediate,deactivated)
same => n,hangup()
same => n(no_recorder),Macro(playback,1,no-recorder-number)
same => n(hangup),Hangup()



[macro-DND_GActivation]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/DoNotDisturbEnable 1)
same => n,Macro(playback,2,do-not-disturb-mode,activated)
same => n(hangup),Hangup()

[macro-DND_GDeactivation]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/DoNotDisturbEnable 0)
same => n,Macro(playback,2,do-not-disturb-mode,deactivated)
same => n(hangup),Hangup()

[macro-DND_GToggle]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/DoNotDisturbEnable)}" = "1" ] ]?:activate)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/DoNotDisturbEnable 0)
same => n,Macro(playback,2,do-not-disturb-mode,deactivated)
same => n,hangup()
same => n(activate),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Groups/Group[Number='${ARG2}']/CallingFeatures/DoNotDisturbEnable 1)
same => n,Macro(playback,2,do-not-disturb-mode,activated)
same => n,Hangup()

[macro-DND_GQuery]
exten => s,1,GotoIf($[ $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/activated)} )}] | $[${REGEX("SIP/${ARG1}"  ${DB(group/${ARG2}/deactivated)} )}] ]?:hangup)
same => n,GotoIf($[ $["${DB(Call_Forward/${ARG2}/DoNotDisturbEnable)}" = "1" ] ]?:deactivated)
same => n,Macro(playback,2,do-not-disturb-mode,activated)
same => n,hangup()
same => n(deactivated),Macro(playback,2,do-not-disturb-mode,deactivated)
same => n,hangup()



[keypad_callwaiting]
exten => *743*1,1,Macro(activated_callwaiting)
exten => *743*0,1,Macro(deactivated_callwaiting)
exten => *743*,1,GotoIf($["${DB(${CALLERID(num)}/CallWaitingEnable)}"="0"]?activate_CW:deactivate_CW)
same => n(activate_CW),Macro(activated_callwaiting)
same => n(deactivate_CW),Macro(deactivated_callwaiting)
exten => **743,1,Macro(query_callwaiting)
exten => *43*1,1,Goto(keypad_callwaiting,*743*1,1)
exten => *43*0,1,Goto(keypad_callwaiting,*743*0,1)
exten => *43*,1,Goto(keypad_callwaiting,*743*,1)
exten => **43,1,Goto(keypad_callwaiting,**743,1)

[macro-activated_callwaiting]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallWaitingEnable 1)
same => n,Macro(playback,2,call-waiting,activated)
same => n,hangup()

[macro-deactivated_callwaiting]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallWaitingEnable 0)
same => n,Macro(playback,2,call-waiting,deactivated)
same => n,hangup()

[macro-query_callwaiting]
exten => s,1,GotoIf($["${DB(${CALLERID(num)}/CallWaitingEnable)}"="1"]?CW_activated:CW_deactivated)
same => n(CW_activated),Macro(playback,2,call-waiting,activated)
same => n,hangup()
same => n(CW_deactivated),Macro(playback,2,call-waiting,deactivated)
same => n,hangup()


[keypad_privacy]
exten => *715*1,1,Macro(activate_privacy)
exten => *715*0,1,Macro(deactivate_privacy)
exten => *715*,1,GotoIf($["${DB(${CALLERID(num)}/AnonymousCallEnable)}"="0"]?activate_privacy:deactivate_privacy)
same => n(activate_privacy),Macro(activate_privacy)
same => n(deactivate_privacy),Macro(deactivate_privacy)
exten => **715,1,Macro(query_privacy)
exten => *65*1,1,Goto(keypad_privacy,*715*1,1)
exten => *65*0,1,Goto(keypad_privacy,*715*0,1)
exten => *65*,1,Goto(keypad_privacy,*715*,1)
exten => **65,1,Goto(keypad_privacy,**715,1)
exten => _*15*X.,1,Set(privacy_callbycall=1)
same => n,Goto(profile_10,${EXTEN:4},1)
exten => _*66*X.,1,Set(privacy_callbycall=1)
same => n,Goto(profile_10,${EXTEN:4},1)

[keypad_CLIP]
exten => *793*1,1,Macro(activate_CLIP)
exten => *33*1,1,Macro(activate_CLIP)
;exten => *793*2,1,Macro(activate_CN_FN)
;exten => *793*3,1,Macro(activate_FN)
;exten => *793*4,1,Macro(activate_FS)
;exten => *793*5,1,Macro(activate_CN_FN_FS)
exten => *793*0,1,Macro(deactivate_CLIP)
exten => *33*0,1,Macro(deactivate_CLIP)

[macro-activate_CLIP]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallerIDEnable 1)
same => n,Macro(playback,2,vpres-caller,activated)
same => n,hangup()

[macro-deactivate_CLIP]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallerIDEnable 0)
same => n,Macro(playback,1,no-vocal-presentation)
same => n,hangup()

[macro-deactivate_privacy]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/AnonymousCallEnable 0)
same => n,Macro(playback,1,shown-number)
same => n,hangup()

[macro-activate_privacy]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/AnonymousCallEnable 1)
same => n,Macro(playback,1,hidden-number)
same => n,hangup()

[macro-query_privacy]
exten => s,1,GotoIf($["${DB(${CALLERID(num)}/AnonymousCallEnable)}"="1"]?privacy_activated:privacy_deactivated)
same => n(privacy_activated),Macro(playback,1,hidden-number)
same => n,hangup()
same => n(privacy_deactivated),Macro(playback,1,shown-number)
same => n,hangup()



[keypad_install]


exten => _**0*XXXX,1,GotoIf($[${CALLERID(num)}=600]?NOTauthorized:authorized)
same => n(authorized),GotoIf($[${EXTEN:4}=0000]?continue:denied)
same => n(continue),Macro(PHONE_UNINSTALLATION,${CALLERID(num)})
same => n,Answer()
same => n,Hangup()
same => n(denied),Macro(playback,1,vm-invalid-password)
same => n,Hangup()
same => n(NOTauthorized),Macro(playback,1,operation-denied)
same => n,Hangup()


exten => _*00*XXXX,1,GotoIf($[${CALLERID(num)}=600]?NOTauthorized:authorized)
same => n(authorized),GotoIf($[${EXTEN:4}=0000]?continue:denied)
same => n(continue),Macro(PHONE_UNINSTALLATION,${CALLERID(num)})
same => n,Answer()
same => n,Hangup()
same => n(denied),Macro(playback,1,vm-invalid-password)
same => n,Hangup()
same => n(NOTauthorized),Macro(playback,1,operation-denied)
same => n,Hangup()


exten => _**0*XXXX*XXX,1,GotoIf($[${EXTEN:9:3}=600]?NOTauthorized:authorized)
same => n(authorized),GotoIf($[${EXTEN:4:4}=0000]?continue:denied)
same => n(continue),Macro(PHONE_UNINSTALLATION,${EXTEN:9:3})
same => n,Answer()
same => n,Hangup()
same => n(denied),Macro(playback,1,vm-invalid-password)
same => n,Hangup()
same => n(NOTauthorized),Macro(playback,1,operation-denied)
same => n,Hangup()


exten => _*00*XXXX*XXX,1,GotoIf($[${EXTEN:9:3}=600]?NOTauthorized:authorized)
same => n(authorized),GotoIf($[${EXTEN:4:4}=0000]?continue:denied)
same => n(continue),Macro(PHONE_UNINSTALLATION,${EXTEN:9:3})
same => n,Answer()
same => n,Hangup()
same => n(denied),Macro(playback,1,vm-invalid-password)
same => n,Hangup()
same => n(NOTauthorized),Macro(playback,1,operation-denied)
same => n,Hangup()


exten => _*01*XXXX*XXX,1,GotoIf($[${CALLERID(num)}=600]?PosteMaintenance:continue)
same => n(PosteMaintenance),GotoIf($[${EXISTS(${SIPPEER(${EXTEN:9:3},context)})}]?continue:denied)
same => n(continue),Macro(PHONE_INSTALLATION,${EXTEN:4:4},${EXTEN:9:3})
same => n(denied),Macro(playback,1,operation-denied)
same => n,Hangup()

exten => _**1*XXXX*XXX,1,GotoIf($[${CALLERID(num)}=600]?PosteMaintenance:continue)
same => n(PosteMaintenance),GotoIf($[${EXISTS(${SIPPEER(${EXTEN:9:3},context)})}]?continue:denied)
same => n(continue),Macro(PHONE_INSTALLATION,${EXTEN:4:4},${EXTEN:9:3})
same => n(denied),Macro(playback,1,operation-denied)
same => n,Hangup()

[macro-PHONE_INSTALLATION]

exten => s,1,GotoIf($[${ARG1}=0000]?next:denied)
same => n(next),GotoIf($[${ARG2}!=${CALLERID(num)}]?continue:out)
same => n(continue),UserEvent(installphone,${CALLERID(num)} ${ARG2})
same => n,Answer()
same => n,Hangup()
same => n(denied),Macro(playback,1,vm-invalid-password)
same => n,Hangup()
same => n(out),Macro(playback,1,operation-denied)
same => n,Hangup()

[macro-PHONE_UNINSTALLATION]
exten => s,1,Macro(ASTdb_DEL,${ARG1})
same => n,UserEvent(uninstallphone,${ARG1} )

[macro-ASTdb_DEL] 

exten => s,1,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnDisconnectedEnable)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnDisconnectedNumber)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardUnconditionalEnable)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardUnconditionalNumber)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnBusyEnable)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnBusyNumber)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnNoAnswerEnable)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/CallForwardOnNoAnswerNumber)})
same => n,Noop(${DB_DELETE(Call_Forward/${ARG1}/DoNotDisturbEnable)})

[macro-NotFound]
exten => s,1,Macro(playback,1,operation-denied)
same => n,Hangup()

[keypad_RingBack]

exten => _*795*0,1,Set(ringback=0)
same => n,NooP(${ringback})
same => n,Macro(SetRingBackUser,${ringback})

exten => _*35*0,1,Set(ringback=0)
same => n,NooP(${ringback})
same => n,Macro(SetRingBackUser,${ringback})

exten => _*795*1,1,Set(ringback=1)
same => n,NooP(${ringback})
same => n,Macro(SetRingBackUser,${ringback})

exten => _*35*1,1,Set(ringback=1)
same => n,NooP(${ringback})
same => n,Macro(SetRingBackUser,${ringback})

exten => _*795*2,1,Macro(Added_RingBackUSER)
exten => _*35*2,1,Macro(Added_RingBackUSER)

exten => _**795,1,Macro(RingBackUSER_Query)
exten => _**35,1,Macro(RingBackUSER_Query)

[macro-SetRingBackUser]

exten => s,1,GotoIf($[${ARG1}=1]?Enable:Disable)
same => n(Enable),GotoIf($["${DB(FileRB/${CALLERID(num)}/EXIST)}"="1"]?activerRBuser:quiter)
same => n(activerRBuser), Set(DB(RingBack_USER/${CALLERID(num)}/Enable)=1)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/RingBack true)
same => n,Macro(playback,2,ringback-message,activated)
same => n,Hangup()
same => n(Disable),Set(DB(RingBack_USER/${CALLERID(num)}/Enable)=0)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/RingBack false)
same => n,Macro(playback,2,ringback-message,deactivated)
same => n,Hangup()
same => n(quiter),Macro(playback,2,ringback-message,unavailable)
same => n,Hangup()

[macro-Added_RingBackUSER]

exten => s,1,NooP(${SHELL(rm /usr/lib/asterisk/customer/ringback/user/${CALLERID(num)}/*)})
same => n, Macro(playback,1,vm-rec-temp)
same => n, Wait(1)
same => n, Record(/usr/lib/asterisk/customer/ringback/user/${CALLERID(num)}/prompt${CALLERID(num)}:g729,,30,k)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/RingBackFileExist true)
same => n,NooP(${SHELL(asterisk -rx "moh reload")})

[macro-RingBackUSER_Query]

exten => s,1,GotoIf($["${DB(RingBack_USER/${CALLERID(num)}/Enable}"="1"]?RingBackEnable:RingBackDisable)
same => n(RingBackEnable),Macro(playback,2,ringback-message,activated)
same => n,Hangup()
same => n(RingBackDisable),Macro(playback,2,ringback-message,deactivated)
same => n,Hangup()

[keypad_Password_change]
exten => _*717*.*.,1,Macro(Password_change,${EXTEN:5})
exten => _*14*.*.,1,Macro(Password_change,${EXTEN:4})

[macro-Password_change]
exten => s,1,GotoIf($[ $["${FIELDQTY(ARG1,*)}" > "2"] | $[${REGEX("#"  ${ARG1})}] ]?refuse)
same => n,Set(old_passwd=${CUT(ARG1,\*,1)})
same => n,GotoIf($["${DB(${CALLERID(num)}/VoicemailPasswd)}" = "${old_passwd}"]?:refuse)
same => n,Set(new_passwd=${CUT(ARG1,\*,2)})
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/VoiceMail/VoiceMailPassword ${new_passwd})
same => n,Macro(playback,1,password-changed)
same => n,Hangup()
same => n(refuse),Macro(playback,1,operation-denied)
same => n,Hangup()

[keypad_PhoneLock]
exten => *17,1,Macro(PhoneLock_Enable)
exten => _*17*X.,1,Macro(PhoneLock_Disable,${EXTEN:4})

[macro-PhoneLock_Enable]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/PhoneLockEnable 1)
same => n,Macro(playback,2,phone-lock-status,unauthorized)
same => n,Hangup()

[macro-PhoneLock_Disable]
exten => s,1,GotoIf($[ "${ARG1}"="${DB(${CALLERID(num)}/VoicemailPasswd)}" ]?:incorrect)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/PhoneLockEnable 0)
same => n,Macro(playback,2,phone-lock-status,authorized)
same => n,hangup()
same => n(incorrect),Macro(playback,1,operation-denied)
same => n,hangup()

[BLF]
exten => _60z,hint,SIP/${EXTEN}
exten => _61x,hint,SIP/${EXTEN}
exten => 620,hint,SIP/${EXTEN}
exten => _4xx,hint,SIP/${EXTEN}

[BLF_pickup]
exten => _*44*60z,1,GotoIf($["${DB(${EXTEN:4}/CallPickUpEnable)}"="1"]?:denied)
same => n,Set(OriginalCodec=${IMPORT(${CHANNELS(SIP/${EXTEN:4})},CHANNEL(audioreadformat))})
same => n,GotoIf($["${OriginalCodec}"="alaw"]?local_call:)
same => n,Set(SIP_CODEC=g729)                                                                 
same => n,Answer()
same => n(local_call),PickupChan(SIP/${EXTEN:4})
same => n(denied),Macro(playback,1,operation-denied)  
same => n,hangup()
exten => _*44*61x,1,GotoIf($["${DB(${EXTEN:4}/CallPickUpEnable)}"="1"]?:denied)
same => n,Set(OriginalCodec=${IMPORT(${CHANNELS(SIP/${EXTEN:4})},CHANNEL(audioreadformat))})
same => n,GotoIf($["${OriginalCodec}"="alaw"]?local_call:)
same => n,Set(SIP_CODEC=g729)                                                                 
same => n,Answer()
same => n(local_call),PickupChan(SIP/${EXTEN:4})
same => n(denied),Macro(playback,1,operation-denied) 
same => n,hangup()
exten => *44*620,1,GotoIf($["${DB(${EXTEN:4}/CallPickUpEnable)}"="1"]?:denied)
same => n,Set(OriginalCodec=${IMPORT(${CHANNELS(SIP/${EXTEN:4})},CHANNEL(audioreadformat))})
same => n,GotoIf($["${OriginalCodec}"="alaw"]?local_call:)
same => n,Set(SIP_CODEC=g729)                                                                 
same => n,Answer()
same => n(local_call),PickupChan(SIP/${EXTEN:4})
same => n(denied),Macro(playback,1,operation-denied) 
same => n,hangup()
exten => _*44*4xx,1,GotoIf($["${DB(${EXTEN:4}/CallPickUpEnable)}"="1"]?:denied)
same => n,Set(OriginalCodec=${IMPORT(${CHANNELS(SIP/${EXTEN:4})},CHANNEL(audioreadformat))})
same => n,GotoIf($["${OriginalCodec}"="alaw"]?local_call:)
same => n,Set(SIP_CODEC=g729)                                                                 
same => n,Answer()
same => n(local_call),PickupChan(SIP/${EXTEN:4})
same => n(denied),Macro(playback,1,operation-denied) 
same => n,hangup()


[keypad_CCBS]
exten => *756*1,1,Macro(CCBS_On)
exten => *756*0,1,Macro(CCBS_Off)
exten => *756*,1,Macro(Toggle_CCBS)
exten => **756,1,Macro(Query_CCBS)

[macro-CCBS_On]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CCBSEnable 1)
same => n,Set(DB(${CALLERID(num)}/CCBSOffered)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSUsed)=0)
same => n,Macro(playback,2,ccbs,activated)
same => n,Hangup()

[macro-CCBS_Off]
exten => s,1,GotoIf($[ "${DB(${CALLERID(num)}/CCBSEnable)}"="1" ]?:incorrect)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CCBSEnable 0)
same => n,Macro(playback,2,ccbs,deactivated)
same => n,Set(DB(${CALLERID(num)}/CCBSOffered)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSUsed)=0)
same => n,hangup()
same => n(incorrect),Macro(playback,1,operation-denied)
same => n,hangup()

[macro-Toggle_CCBS]
exten => s,1,GotoIf($[ "${DB(${CALLERID(num)}/CCBSEnable)}"="1" ]?:incorrect)
same => n,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CCBSEnable 0)
same => n,Macro(playback,2,ccbs,deactivated)
same => n,Hangup()
same => n(incorrect),UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CCBSEnable 1)
same => n,Macro(playback,2,ccbs,activated)
same => n,hangup()

[macro-Query_CCBS]
exten => s,1,GotoIf($[ "${DB(${CALLERID(num)}/CCBSEnable)}"="1" ]?:incorrect)
same => n,Macro(playback,2,ccbs,activated)
same => n,Hangup()
same => n(incorrect),Macro(playback,2,ccbs,deactivated)
same => n,hangup()

[keypad_CCBS_Current]
exten => *56,1,Macro(CCBS_Delete_current)
exten => **56,1,Macro(Query_CCBS_current)

[macro-CCBS_Delete_current]
exten => s,1,GotoIf($["${DB(${CALLERID(num)}/CCBSTo)}"!="0" ]?:incorrect)
same => n,CallCompletionCancel() 
same => n,Set(DB(${DB(${CALLERID(num)}/CCBSTo)}/CCBSOffered)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSTo)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSTime_Start)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSUsed)=0)
same => n,Macro(playback,1,delete-ccbs)
same => n,hangup()
same => n(incorrect),Macro(playback,1,no-waiting-ccbs)
same => n,hangup()

[macro-Query_CCBS_current]
exten => s,1,GotoIf($["${DB(${CALLERID(num)}/CCBSTo)}"!="0" ]?exist:notexist)
same => n(exist),GotoIf($[${MATH(${EPOCH}-$["${DB(${CALLERID(num)}/CCBSTime_Start)}"],i)} < ${CALLCOMPLETION(ccbs_available_timer)}]?true:notexist)
same => n(true),Macro(playback,1,waiting-ccbs-to)
same => n,Saydigits(${DB(${CALLERID(num)}/CCBSTo)})
same => n,NoOp( ***** ${CALLCOMPLETION(ccbs_available_timer)} *****)
same => n,hangup()
same => n(notexist),Set(DB(${CALLERID(num)}/CCBSTo)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSTime_Start)=0)
same => n,Set(DB(${DB(${CALLERID(num)}/CCBSTo)}/CCBSOffered)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSUsed)=0)
same => n,Macro(playback,1,no-waiting-ccbs)
same => n,hangup()

[macro-CB_CCBS]
exten => s,1,Set(DB(${DB(${CALLERID(num)}/CCBSTo)}/CCBSOffered)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSTime_Start)=0)
same => n,NoOp(**** ${DB(${CALLERID(num)}/CCBSTo)} ****)
same => n,Set(DB(${CALLERID(num)}/CCBSTo)=0)
same => n,Set(DB(${CALLERID(num)}/CCBSUsed)=0)
same => n,NoOp(************ Reset CCBSTo ************)

[keypad_CallPickUpProtection]
exten => *744*1,1,Macro(CallPickUpProtection_On)
exten => *744*0,1,Macro(CallPickUpProtection_Off)
exten => **744,1,Macro(Query_CallPickUpProtection)
exten => *40,1,Macro(CallPickUpProtection_On)
exten => *41,1,Macro(CallPickUpProtection_Off)

[macro-CallPickUpProtection_On]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallPickUpEnable 0)
same => n,Macro(playback,2,allow-pickup,deactivated)
same => n,Hangup()

[macro-CallPickUpProtection_Off]
exten => s,1,UserEvent(dbset,Device/Services/VoiceServices/VoiceService[@uid='2']/ExtensionProfiles/ExtensionProfile[@uid='1']/Extensions/Extension[ExtensionNumber='${CALLERID(num)}']/CallingFeatures/CallPickUpEnable 1)
same => n,Macro(playback,2,allow-pickup,authorized)
same => n,Hangup()

[macro-Query_CallPickUpProtection]
exten => s,1,GotoIf($["${DB(${CALLERID(num)}/CallPickUpEnable)}"="1"]?activated:deactivated)
same => n(activated),Macro(playback,2,allow-pickup,authorized)
same => n,Hangup()
same => n(deactivated),Macro(playback,2,allow-pickup,deactivated)
same => n,Hangup()

[Keypad_annuaire]
exten => _7XX,1,GotoIf($["${EXISTS(${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)})}"="1"]?:hangup)
same => n,Set(NumberCalled=${forwards} ${EXTEN})
same => n, GotoIf($[${FIELDQTY(NumberCalled, )} > 2]?forwarded_call:direct_dial)
same => n(direct_dial), Set(Number=${CALLERID(num)})
same => n, Set(DirectCall=1)
same => n, Goto(next)
same => n(forwarded_call), Set(Number=${CUT(NumberCalled, ,2)})
same => n(next),NoOp( ******** ${Number} ******** )
same => n,Macro(Verify_Profile_Before_Call,${Number},${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)},${DirectCall})
same => n,Macro(annuaire,${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)})
same => n(hangup),Macro(playback,1,no-recorder-number)
same => n,hangup()

exten => _8[0-6]X,1,GotoIf($["${EXISTS(${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)})}"="1"]?:hangup)
same => n,Set(NumberCalled=${forwards} ${EXTEN})
same => n, GotoIf($[${FIELDQTY(NumberCalled, )} > 2]?forwarded_call:direct_dial)
same => n(direct_dial), Set(Number=${CALLERID(num)})
same => n, Set(DirectCall=1)
same => n, Goto(next)
same => n(forwarded_call), Set(Number=${CUT(NumberCalled, ,2)})
same => n(next),NoOp( ******** ${Number} ******** )
same => n,Macro(Verify_Profile_Before_Call,${Number},${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)},${DirectCall})
same => n,Macro(annuaire,${DB(${EXTEN}/CONTACT_EXT-SHORT-NUMBER)})
same => n(hangup),Macro(playback,1,no-recorder-number)
same => n,hangup()

exten => _87X,1,Set(NumberCalled=${forwards} ${EXTEN})
same => n, GotoIf($[${FIELDQTY(NumberCalled, )} > 2]?forwarded_call:direct_dial)
same => n(direct_dial), Set(Number=${CALLERID(num)})
same => n, Set(DirectCall=1)
same => n, Goto(next)
same => n(forwarded_call), Set(Number=${CUT(NumberCalled, ,2)})
same => n(next),NoOp( ******** ${Number} ******** )
same => n, GotoIf($[ "${REGEX(":${EXTEN}:" ${DB(${Number}/LIST_PERSO_SHORT-NUM)})}"="1" ]?:hangup)
same => n,Set(count_contact=${FIELDQTY(DB(${Number}/LIST_PERSO_SHORT-NUM),#)})
same => n,Set(count=1)
same => n,Set(last_count=$[${count_contact} - 1])
same => n,While($[${count} < ${last_count}]
same => n,Set(one_contact=${CUT(DB(${Number}/LIST_PERSO_SHORT-NUM),#,$[${count}+1])})
same => n,NoOp(one contact : ${One_Contact})
same => n,GotoIf($[ "${REGEX("${EXTEN}" ${One_Contact})}"="1" ]?:Next_Contact)
same => n,Set(Number_To_Call=${CUT(One_Contact,:,3)})
same => n,NoOp(#${Number_To_Call}#)
same => n,ExitWhile() 
same => n(Next_Contact),Set(count=$[${count} + 1])
same => n,EndWhile()
same => n,Macro(Verify_Profile_Before_Call,${Number},${Number_To_Call},${DirectCall})
same => n,Macro(annuaire,${Number_To_Call})
same => n(hangup),Macro(playback,1,no-recorder-number)
same => n,hangup()

[macro-annuaire]
exten => s,1,Goto(profile_10,${ARG1},1)
same => n,hangup()

