# Headlessplayback

A simple yet complete playback library designed for UI frameworks or even without

## Architecture

- Headless UI
- Bridge design pattern
- Plugin-based system
- Minimal API surface to avoid breaking changes
- Embrace the web platform APIs
- Avoid framework-specific locked-in APIs

## Technology decisions

- [Changesets](https://github.com/changesets/changesets) - for versioning
- [Happy-dom](https://github.com/capricorn86/happy-dom) - for node-based browser testing environment
- [Playwright](https://playwright.dev/) - for e2e testing across browsers
- [Tsup](https://tsup.egoist.dev/) - for bundling libraries
- [Turbo](https://turbo.build/repo) - for remote-caching build system
- [Github Actions](https://github.com/features/actions) - for CI/CD
- [Netlify](https://www.netlify.com/) - for hosting
- [TypeScript](https://www.typescriptlang.org/) - for type safety
- [Vite](https://vitejs.dev/) - for examples application
- [Vitepress](https://vitepress.dev/) - for documentation
- [Vitest](https://vitest.dev/) - for unit and integration testing

## Roadmap

- [ ] Write a complete test suites before implementation
- [ ] Implement core logic
- [ ] Write documentation and add examples
- [ ] Implement framework adapters
- [ ] Implement some common use plugins such as data streaming

## Supported framework adapters

- [ ] Vue - coming soon
- [ ] Preact - coming soon
- [ ] Svelte - coming soon
- [ ] Solid - coming soon
- [ ] React - coming soon
- [ ] SOlid - coming soon

## Inspiration

- [Tanstack](https://tanstack.com) - A collection of high-quality open source libraries for web developers
- [Zag](https://zagjs.com) - A collection of framework-agnostic UI component patterns
- [Day.js](https://day.js.org/docs/en/plugin/plugin) - A modern JavaScript date utility library
- [VueUse](https://vueuse.org) - Collection of Essential Vue Composition Utilities
- [Radix UI](https://www.radix-ui.com) - A collection of open source UI components
- [Building a modern design system in layers](https://blog.almaer.com/building-a-modern-design-system-in-layers/?ck_subscriber_id=1238259209)
- [UI frameworks and Media Elements 🎧](https://medium.com/axon-enterprise/ui-frameworks-and-media-elements-c0c6832528e5)

## Sponsor

<a href="https://www.buymeacoffee.com/namnguyenle" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

## License

MIT © [Nam Nguyen](https://github.com/willnguyen1312)
