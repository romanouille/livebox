#! /bin/ash

if [ -z $1 ]
then
xmo-client -p  Device/NAT/PortMappings/PortMapping[Creator=\"USER\"] -c "ft" -i "http://orange.fr/data" -g | grep -v "path" | grep -v "value" | grep -v "PortMapping"
else
xmo-client -p  Device/NAT/PortMappings/PortMapping[@uid=\"$1\"] -c "ft" -i "http://orange.fr/data" -g | grep -v "path" | grep -v "value" | grep -v "PortMapping"
fi

