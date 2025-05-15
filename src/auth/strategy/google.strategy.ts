// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-google-oauth20';
// import { PrismaService } from '../../../prisma/prisma.service/prisma.service';
// import { AuthService } from '../service/auth.service';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly authService: AuthService,
//   ) {
//     super({
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: 'http://localhost:8080/auth/google/redirect',
//       scope: ['email', 'profile'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
//     console.log('GOOGLE PROFILE:', profile);
//     const { email, given_name, family_name } = profile._json;

//     // let user = await this.prisma.user.findUnique({ where: { email } });

//     // if (!user) {
//     //   user = await this.prisma.user.create({
//     //     data: {
//     //       email,
//     //       fullName: `${given_name} ${family_name}`,
//     //       provider: 'google',
//     //       username: `google_${Date.now()}`,
//     //       phone: '0000000000', // You can set a default value for phone
//     //     },
//     //   });
//     // }

//     // done(null, user);
//   }
// }
