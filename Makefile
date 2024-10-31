VERSION := $(shell git describe --tags | sed 's/\(.*\)-.*/\1/')

version:
	@echo "export default '$(VERSION)'" > 'src/config/version.js'

dev:
	sudo npm run dev80
