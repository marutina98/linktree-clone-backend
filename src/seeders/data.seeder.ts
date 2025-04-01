
// Imports

import { faker } from '@faker-js/faker';

// Services

import { prisma } from '../services/prisma.service';
import { bcryptService } from '../services/bcrypt.service';
import { placeholder } from '../services/placeholder.service';

class DataSeeder {

  async init() {

    // Create 5 Users with 5 Links each.

    try {
      for (let i = 0; i < 5; i++) {
        const user = await this.createUser();
        if (user) {
          for (let j = 0; j < 5; j++) {
            const link = await this.createLink(user.id);
          }
        }
      }
    } catch (error: unknown) {
      console.error(error);
    }

  }

  // Create a User with Fake Data and a
  // base64 placeholder image.

  async createUser() {

    try {

      const randomName = faker.person.fullName();
      const randomEmail = faker.internet.email();
      const randomBiography = faker.person.bio();

      const password = await bcryptService.hashPassword('password');

      const user = await prisma.user.create({

        data: {

          email: randomEmail,
          password: password,

          profile: {

            create: {

              name: randomName,
              biography: randomBiography,
              picture: placeholder,

            }

          }

        },
        
        include: {
          profile: true,
          links: true
        },

        omit: {
          password: true,
        }

      });

      if (!user) {
        throw new Error('User could not be created.')
      }

      return user;

    } catch (error: unknown) {
      console.error(error);
    }

  }

  // Create a Link with Fake Data
  // The Icon is an emoji converted into
  // unicode

  async createLink(userId: number) {

    try {

      const randomURL = faker.internet.url();
      const randomName = faker.lorem.words({ min: 1, max: 10 });
      const randomIcon = faker.internet.emoji();
      const randomIconUnicode = randomIcon.codePointAt(0)!.toString(16);
      const order = await this.getCorrectOrder(userId);
  
      const link = await prisma.link.create({
  
        data: {
          url: randomURL,
          name: randomName,
          icon: randomIconUnicode,
          order,
          userId,
        }
  
      });
  
      if (!link) {
        throw new Error('Link could not be created');
      }
  
      return link;

    } catch (error: unknown) {
      console.error(error);
    }

  }

  async getCorrectOrder(userId: number) {

    const maxOrderLink = await prisma.link.findFirst({

      where: {
        userId: userId,
      },

      orderBy: {
        order: 'desc',
      }

    });

    return maxOrderLink ? maxOrderLink.order + 1 : 1;

  }

}

export const dataSeeder = new DataSeeder();