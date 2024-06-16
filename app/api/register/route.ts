import {PrismaClient} from '@prisma/client'
import bcrypt from 'bcrypt'
import {NextResponse} from "next/server";

const prisma = new PrismaClient()

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({error: 'Failed to fetch users'}, {status: 500});
    }
}

export async function POST(req: Request) {
    try {
        // Parse the request body
        const { username, password, firstname, lastname, department, img, role } = await req.json();

        // Ensure password is provided
        if (!password) {
            throw new Error('Password is required');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create the user in the database
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                firstname,
                lastname,
                department,
                img,
                role,
            },
        });

        // Return the created user as JSON response
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        // Parse the request body and url parameters
        const { id } = await req.json();
        const { username, password, firstname, lastname, department, img, role } = await req.json();

        // Fetch the user to be updated
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            throw new Error('User not found');
        }

        // Hash the password if provided
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 12);
        }

        // Update the user in the database
        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                username,
                password: hashedPassword || user.password,
                firstname,
                lastname,
                department,
                img,
                role,
            },
        });

        // Return the updated user as JSON response
        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

// DELETE request to delete a user by id
export async function DELETE(req: Request) {
    try {
        // Parse the request body
        const { id } = await req.json();

        // Delete the user from the database
        const deletedUser = await prisma.user.delete({
            where: { id },
        });

        // Return the deleted user as JSON response
        return NextResponse.json(deletedUser);
    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}