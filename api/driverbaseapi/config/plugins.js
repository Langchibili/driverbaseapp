// module.exports = ({ env }) => ({
//   upload: {
//       provider: "ftp",
//       providerOptions: {
//         // host: env("FTP_HOST"),
//         // port: env("FTP_PORT"),
//         // user: env("FTP_USER"),
//         // password: env("FTP_PASSWORD"),
//         // secure: env.bool("FTP_SECURE", true),
//         // path: env("FTP_BASE_PATH"),
//         // baseUrl: env("FTP_BASE_URL"),
//         // maxFileSize: 100 * 1024 * 1024, // 100MB in bytes

//         host: 'ftp.thenetworkzambia.com',
//         port: '21',
//         user: 'langson@driverbase.thenetworkzambia.com',
//         password: '@Adminuser007',
//         secure: true,
//         path: '/files',
//         baseUrl: 'https://driverbase.thenetworkzambia.com/',
//         maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
//       },
//     enabled: true,
//     name: "strapi",
//     sizes: {
//       thumb: {
//         width: 640,
//         height: 480,
//       },
//       medium: {
//         width: 800,
//         height: 600,
//       },
//       large: {
//         width: 1200,
//         height: 900,
//       },
//     },
//     breakpoints: {
//       xlarge: 1920,
//       large: 1000,
//       medium: 750,
//       small: 500,
//       xsmall: 64,
//     },
//   },
//   'users-permissions': {
//     config: {
//       jwt: {
//         expiresIn: '7d',
//       },
//     },
//   },
// });


module.exports = ({ env }) => ({
  // provider: "local",
    // providerOptions: {
    //   destination: "./public/uploads",
    //   maxFileSize: 100 * 1024 * 1024, // 100MB in bytes
    // },
  'strapi-plugin-fcm': {
      enabled: true,
      //resolve: './src/plugins/strapi-plugin-fcm' // path to plugin folder
    },
    upload: {
        providerOptions: {
          provider: "local",
          destination: "./public/uploads",
      // set max file size
      maxFileSize: 100 * 1024 * 1024 // 100MB in bytes
        },
        name: "strapi::body",
        config: {
          formLimit: "256mb", // modify form body
          jsonLimit: "256mb", // modify JSON body
          textLimit: "256mb", // modify text body
          formidable: {
            maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
          },
          sizeLimit: 250 * 1024 * 1024, // 256mb in bytes
          breakpoints: {
            xlarge: 1920,
            large: 1000,
            medium: 750,
            small: 500,
            xsmall: 64
          },
        },
      },
    'users-permissions': {
      config: {
        jwt: {
          expiresIn: '30d',
        },
      },
    }
  });

 