# this image is built and updated weekly
# https://github.com/cse-labs/codespaces-images

FROM ghcr.io/kutespaces/cdk8s:vscode-extension AS vscode-extension

FROM ghcr.io/cse-labs/k3d:latest

SHELL ["/bin/bash", "-c"]

# upgrade k3d
RUN wget -q -O - https://raw.githubusercontent.com/rancher/k3d/main/install.sh | TAG=v5.6.0 bash

RUN mkdir -p /.kutespaces/state \
 && chown vscode:vscode /.kutespaces/state
COPY --from=vscode-extension /extension.vsix /.kutespaces/extension.vsix

# some images require specific values
ARG USERNAME=vscode

USER $USERNAME

RUN git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.10.2 \
 && . $HOME/.asdf/asdf.sh \
 && asdf plugin add nodejs \
 && asdf install nodejs 18.12.0 \
 && asdf global nodejs 18.12.0 \
 && echo ". ~/.asdf/asdf.sh" >> ~/.zshrc
