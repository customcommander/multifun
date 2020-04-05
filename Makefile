dist/index.js: index.js
	mkdir -p $(@D)
	java -jar /workspaces/closure-compiler/compiler.jar \
		--compilation_level=SIMPLE_OPTIMIZATIONS \
		--language_in=ECMASCRIPT_2018 \
		--language_out=ECMASCRIPT_2015 \
		--js=$^ \
		--js_output_file=$@

