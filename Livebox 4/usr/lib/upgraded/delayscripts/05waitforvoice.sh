

VOICE_APP=VoiceService.VoiceApplication
PROFILE_PATH=${VOICE_APP}.VoiceProfile
VOICE_STATUS=${VOICE_APP}?{X_ORANGE-COM_Status}

#Quiescent all the SIP && H323 Trunk Lines
pcb_cli "$VOICE_APP.quiesceAllTrunkLines()"

#Wait for the Voice Application to Disable all the trunk lines
STATUS=`pcb_cli -l "$VOICE_STATUS"`
echo "Voice status: $STATUS"
while [ "$STATUS" != "Disabled" ] && [ "$STATUS" != "" ]
do
    STATUS=`pcb_cli -w 10 -l "$VOICE_STATUS"`
done
echo "Voice status: $STATUS"
echo " ----> waiting done!"

# make sure fxo is IDLE
echo "  -- Make sure FXO is idle"
while [ 1 ]
do
   STATUS="IDLE"
   STATUS_LIST=`pcb_cli "$PROFILE_PATH.FXO.Line?" | grep "Callstate" | sed s/[^=]*=//`
   for lstatus in $STATUS_LIST
   do
        if [ "$STATUS" == "IDLE" ] && [ "$lstatus" != "IDLE" ]; then
            STATUS=$lstatus
        fi
   done
   if [ "$STATUS" == "IDLE" ]; then
        break
   fi
   sleep 10
done
echo "  ----> FXO is idle"
