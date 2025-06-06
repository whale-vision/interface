import {
  BrowserWindow,
  Menu,
  shell,
} from 'electron';

export default class MenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
      this.mainWindow = mainWindow;
  }

  buildMenu() {
    const template = this.buildDefaultTemplate();

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    return menu;
  }

  buildDefaultTemplate() {
      const templateDefault = [
          {
              label: `&File`,
              submenu: [
                  {
                      label: `&Open`,
                      accelerator: `Ctrl+O`,
                  },
                  {
                      label: `&Close`,
                      accelerator: `Ctrl+W`,
                      click: () => {
                          this.mainWindow.close();
                      },
                  },
              ],
          },
          {
              label: `&View`,
              submenu:
                  process.env.NODE_ENV === `development`
                  || process.env.DEBUG_PROD === `true` ?
                      [
                          {
                              label: `&Reload`,
                              accelerator: `Ctrl+R`,
                              click: () => {
                                  this.mainWindow.webContents.reload();
                              },
                          },
                          {
                              label: `Toggle &Full Screen`,
                              accelerator: `F11`,
                              click: () => {
                                  this.mainWindow.setFullScreen(
                                      !this.mainWindow.isFullScreen(),
                                  );
                              },
                          },
                          {
                              label: `Toggle &Developer Tools`,
                              accelerator: `Alt+Ctrl+I`,
                              click: () => {
                                  this.mainWindow.webContents.toggleDevTools();
                              },
                          },
                      ]
                      : [
                          {
                              label: `Toggle &Full Screen`,
                              accelerator: `F11`,
                              click: () => {
                                  this.mainWindow.setFullScreen(
                                      !this.mainWindow.isFullScreen(),
                                  );
                              },
                          },
                      ],
          },
          {
              label: `Help`,
              submenu: [
                  {
                      label: `Learn More`,
                      click() {
                          shell.openExternal(`https://electronjs.org`);
                      },
                  },
                  {
                      label: `Documentation`,
                      click() {
                          shell.openExternal(
                              `https://github.com/electron/electron/tree/main/docs#readme`,
                          );
                      },
                  },
                  {
                      label: `Community Discussions`,
                      click() {
                          shell.openExternal(
                              `https://www.electronjs.org/community`,
                          );
                      },
                  },
                  {
                      label: `Search Issues`,
                      click() {
                          shell.openExternal(
                              `https://github.com/electron/electron/issues`,
                          );
                      },
                  },
              ],
          },
      ];

      return templateDefault;
  }
}
