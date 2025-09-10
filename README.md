# p2wviewer

An app written in Rust with Tauri to encrypt and decrypt images into self-contained noise images. See the [p2wviewer-lib](https://github.com/p2wviewer/p2wviewer-lib) for the core library.

## Features
  - **Encrypt:** Encrypts an image into a new image that appears as random noise.
  - **Decrypt:** Decrypts a previously encrypted image back to its original state.
  - **Password-based encryption:** Use a password to en- and decrypt your images.
  - **File support:** Use a file as a key for en- and decryption.
  - **Image splitting:** Encrypt a single image into multiple blocks for security and avoid detection.

## Installation

You can download precompiled binaries from the [releases page](https://github.com/p2wviewer/p2wviewer/releases) or automatic github actions artifacts.

[In progress]