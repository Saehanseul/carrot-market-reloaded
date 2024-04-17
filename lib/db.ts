import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function test() {
  // const token = await db.sMSToken.create({
  //   data: {
  //     token: "133234",
  //     user: {
  //       connect: {
  //         id: 1
  //       }
  //     }
  //   }
  // });
  // console.log(token);
  const tokenList = await db.sMSToken.findMany({
    include: {
      user: true
    }
  });
}

test();

export default db;
