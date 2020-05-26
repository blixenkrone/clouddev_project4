deploy:
	export NODE_OPTIONS=--max_old_space_size=8192 \
	&& cd ./backend \
	&& sls deploy -v --aws-region eu-west-1
