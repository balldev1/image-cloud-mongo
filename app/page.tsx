"use client"
import {useCallback, useState} from 'react';
import axios from "axios";
import { CldUploadWidget } from 'next-cloudinary';

export default function Home() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [department, setDepartment] = useState('');
    const [role, setRole] = useState('');
    const [img, setImg] = useState('');
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');

    // Update img state with secure URL
    const handleUpload = useCallback((result: any) => {
        setImg(result.info.secure_url);
        setUploadedImageUrl(result.info.secure_url); // Set the uploaded image URL for display
    }, [setImg, setUploadedImageUrl]);

    const handleSubmit = useCallback(async () => {
        try {
            await axios.post('/api/register', {
                username,
                password,
                firstname,
                lastname,
                department,
                img,
                role
            });
        } catch {
            console.error(Error);
        }
    }, [username, password, firstname, lastname, department, img, role])

    return (
        <main className="w-full min-h-screen flex justify-center items-center">
            <div className="w-48 flex flex-col justify-center items-center space-y-5"   >
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="password"
                        className="grow"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Firstname"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Lastname"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Img"
                        value={img}
                        onChange={(e) => setImg(e.target.value)}
                    />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <input
                        type="text"
                        className="grow"
                        placeholder="Role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    />
                </label>
                <CldUploadWidget
                    onUpload={handleUpload}
                    uploadPreset='n2sb3ooy'
                    options={{
                        maxFiles: 1
                    }}
                >
                    {({ open }) => {
                        return (
                            <div
                                onClick={() => open?.()}
                            >
                                <div className='font-semibold text-lg'>
                                    Click to upload
                                </div>
                            </div>
                        )
                    }}
                </CldUploadWidget>
                {uploadedImageUrl && (
                    <img src={uploadedImageUrl} alt="Uploaded" className="w-40 h-40 object-cover mt-4" />
                )}
                <button className="btn btn-accent" onClick={handleSubmit}>
                    Log State
                </button>
            </div>
        </main>
    );
}

// #DATABASE_URL=""
// NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
// https://next.cloudinary.dev/clduploadbutton/basic-usage
// cloudinary