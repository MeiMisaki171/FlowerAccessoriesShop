// import { Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { Strategy, VerifyCallback } from 'passport-facebook';
// import { PrismaService } from '../../../prisma/prisma.service/prisma.service';

// @Injectable()
// export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
//   constructor(private readonly prisma: PrismaService) {
//     super({
//       clientID: process.env.FACEBOOK_APP_ID,
//       clientSecret: process.env.FACEBOOK_APP_SECRET,
//       callbackURL: 'http://localhost:8080/auth/facebook/callback',
//       profileFields: ['id', 'emails', 'name'],
//     });
//   }

//   async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
//     const { email, first_name, last_name } = profile._json;

//     // let user = await this.prisma.user.findUnique({ where: { email } });

//     // if (!user) {
//     //   user = await this.prisma.user.create({
//     //     data: {
//     //       email,
//     //       fullName: `${first_name} ${last_name}`,
//     //       provider: 'facebook',
//     //       username: `facebook_${Date.now()}`,
//     //       phone: '0000000000', // Default phone number
//     //     },
//     //   });
//     // }

//     // done(null, user);
//   }
// }
