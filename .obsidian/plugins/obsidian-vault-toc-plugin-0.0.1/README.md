# Obsidian plugin for generating Table of Contents for a Vault

The plugin comes handy when you have a well-structured vault and for example building a knowledge base with a lot of nesting and sections.
It generates a file in the root folder that represents a tree structure of your vault ignoring everything that is not a markdown file.

## Example

The following vault:

```
Python/
  Iterators.md
  GIL.md
Frontend/
  React/
    Virtual DOM.md
    hooks.md
  Svelte/
    SSR.md
files/
  screenshot_001.png
```

Will be transformed into `TOC.md` with the following content:

- **Python**
  - [Iterators](/)
  - [GIL](/)
- **Frontend**
  - **React**
    - [Virtual DOM](/)
    - [hooks](/)
  - **Svelte**
    - [SSR](/)

In Obsidian all that sections are collapseable, so it's easy to navigate across your vault from a single file.

Since it's aimed for knowledge bases, it's possible to enable highlighting of the files that are incomplete or empty and require some refinement. It's calculated based on the file size and will look like this:

- **Python**
  - [Iterators](/)
  - [🚧 GIL](/)
  - [🚧 Decorators](/)
  - [Context managers](/)


## Manually installing the plugin

- Download `.zip` archieve from Releases and unpack it into `VaultFolder/.obsidian/plugins/`
- Turn on `Community plugins` and enable `Vault Table of Contents` in the list
