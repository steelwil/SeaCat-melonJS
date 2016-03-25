.PHONY: clean All

All:
	@echo "----------Building project:[ TuronsSeaCat - Debug ]----------"
	@cd "/home/disk/wil/Downloads/games/Turon/melonjs/SeaCat" && "$(MAKE)" -f  "TuronsSeaCat.mk"
clean:
	@echo "----------Cleaning project:[ TuronsSeaCat - Debug ]----------"
	@cd "/home/disk/wil/Downloads/games/Turon/melonjs/SeaCat" && "$(MAKE)" -f  "TuronsSeaCat.mk" clean
