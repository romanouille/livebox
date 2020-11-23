

PROFILE_PATH=VoiceService.VoiceApplication.VoiceProfile
VOICE_STATUS=VoiceService.VoiceApplication.X_ORANGE-COM_Status

# loop over the voice profiles
for i in `pcb_cli $PROFILE_PATH.?0`
do
  if [ "$i" != "$PROFILE_PATH" ] && [ "$i" != "$PROFILE_PATH.ATA" ] && [ "$i" != "$PROFILE_PATH.FXO" ] && [ "$i" != "$PROFILE_PATH.SIP-Extensions" ]
  then
    echo -n "-- Voice profile: $i.Enable=["
    STATUS=`pcb_cli "$i.Enable?" | grep "$i.Enable" | sed s/$i.Enable=//`
    echo "$STATUS]"
    if [ "$STATUS" != "Disabled" ]
    then
      echo " --> profile is not disabled, set to Quiescent and wait for the call to end"
      pcb_cli "$i.Enable=Quiescent"
      sleep 1
      STATUS=`pcb_cli -l "$VOICE_STATUS?"`
      while [ "$STATUS" != "Disabled" ]
      do
        sleep 10
        STATUS=`pcb_cli -l "$VOICE_STATUS?"`
        if [ "$STATUS" == "" ]
        then
            break
        fi
      done
      echo " ----> waiting done!"
    fi
  fi
done


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
