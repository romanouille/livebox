RGSRC=../../../
include $(RGSRC)/envir.mak

RAMDISK_IMG_FILES+=arrowdowngrey.gif left-action-disable.gif left-simple-hover.gif poubelle.jpg \
				   right-normal.gif arrowdownorange.png left-action-hover.gif left-simple-normal.gif \
				   previous-arrow.gif arrowupgrey.png left-action-normal.gif Makefile right-clic.gif \
				   arrowuporange.png left-simple-clic.gif next-arrow.gif right-disable.gif close.gif \
				   left-action-clic.gif left-simple-disable.gif next.gif right-hover.gif \
				   next-dbl-arrow.gif previous-dbl-arrow.gif loupe.png gear.png poubelle-disable.jpg \
				   left-back-clic.gif left-back-disable.gif left-back-hover.gif left-back-normal.gif \
				   undo.png loupe-disable.png gear-disable.png wps.jpg checkbox-disable.png

ifndef CONFIG_LIVEBOX_VER_APP2_BE
RAMDISK_IMG_FILES+= help.gif
endif
RAMDISK_FILES=$(RAMDISK_IMG_FILES:%=/home/httpd/html/images/button/%)

include $(RGMK)
