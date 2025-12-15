
import { prisma } from './client'
import express from "express";
import cors from "cors";
import { validateSignup } from './utils/validators'
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import cookieParser from 'cookie-parser';
import { createHashedPassword, signUpUser, getJwtToken,  } from "./services/service"
const app = express();
import type { AuthRequest } from './utils/types'
import { authUser } from './middlewares/userAuth'
import authRouter from './routes/auth'
import habitRouter from './routes/habit'
app.use(cors());
app.use(express.json());
app.use(cookieParser())

app.use('/',authRouter)
app.use('/',habitRouter)


// app.get("/", (req: Request, res: Response) => {
//   res.send("Express + Prisma v7 API is running 🚀");
// });

// app.post("/login", async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body
//     const loggedInUser = await prisma.user.findUnique({
//       where: {
//         email: email
//       }
//     })
//     if (!loggedInUser) {
//       throw new Error("User not found!")
//     }
//     const match = await bcrypt.compare(password, loggedInUser.password)
//     if (match) {
//       //const name=loggedInUser.name
//       const token = await getJwtToken(loggedInUser)
//       console.log("Login token", token)
//       res.cookie("token", token)
//       res.json({ message: "User loggedin successfully" })
//     }

//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(400).send(err.message)
//     } else {
//       console.error(err);
//     }

//   }
// })

// app.post("/signup", async (req: Request, res: Response) => {
//   try {
//     const { email, password, name } = req.body
//     //const hashOfYourpassword = createHashedPassword(password)
//     const errors = validateSignup({ email, password, name });

//     if (errors.length > 0) {
//       return res.status(400).json({ errors });
//     }
//     await signUpUser(email, password, name)
//     const token = await getJwtToken(req.body)
//     console.log(token)
//     res.cookie("token", token)
//     res.json({ message: "User sign up successfull!" })
//   } catch (err) {
//     if (err instanceof Error) {
//       res.status(400).send(err.message)
//     } else {
//       console.error(err);
//     }

//   }
// })

// app.post("/logout", authUser, async (req: AuthRequest, res: Response) => {
//   const { token } = req.cookies
//   const user = req.user
//   if (!token) {
//     throw new Error("Please login to logout man!")
//   }
//   // const name = req.user?.name;
//   // res.clearCookie("token", {
//   //   httpOnly: true
//   // });
//   // res.send(`${name ?? "User"} logged out successfully!`);
//   res.cookie("token", "", { expires: new Date(0) })
//   res.send(`${user?.name} is logged out!`);
// })

// app.post("/createhabit", authUser, async (req: AuthRequest, res: Response) => {
//   try{
//     const { name, frequency } = req.body as { name?: unknown; frequency?: unknown };
//     if (typeof name !== "string" || name.trim().length === 0) {
//       return res.status(400).json({ error: "Name is required and must be a non-empty string." });
//     }

//     if (typeof frequency !== "string" || !ALLOWED_FREQUENCIES.includes(frequency as any)) {
//       return res.status(400).json({
//         error: `Frequency is required and must be one of: ${ALLOWED_FREQUENCIES.join(", ")}`,
//       });
//     }
//     const userFromReq = req.user;
//     console.log(userFromReq)
//     if (!userFromReq || !userFromReq.id) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }
//     const userId = Number(userFromReq.id);
//     if (Number.isNaN(userId)) {
//       return res.status(500).json({ error: "Invalid user id on request" });
//     }
//     const created = await prisma.habit.create({
//       data: {
//         user: { connect: { id: userId } },
//         name: name.trim(),
//         frequency: frequency,
//         // currentStreak defaults to 0 in schema; createdAt/updatedAt handled by prisma
//       },
//     });

//     return res.status(201).json({ message: "Habit created" });
//   } catch (err) {
//     console.error("Create habit error:", err);
//     return res.status(500).json({ error: "Server error" });
//   }
// })

// app.get("/habits",authUser, async (req:AuthRequest, res:Response) => {
//   try {
//     const loggedInUser= req.user
//     if (!loggedInUser?.id) {
//       return res.status(401).json({ error: "Not authenticated" });
//     }
//     const habits = await prisma.habit.findMany({ where: { userId: loggedInUser.id } });
//     res.json(habits);
//   } catch (err) {
//     console.error("Error fetching habits:", err);
//     res.status(500).json({ error: "Failed to fetch habits" });
//   }
// });

// app.post("/habits/:id/complete" ,authUser, async(req:AuthRequest, res:Response) =>{

// })

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
