import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div className="bg-brown min-h-screen relative text-yellow modern-padding pt-[86px] md:pt-[148px]">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between pb-[48px] gap-[48px] md:gap-0 page-header">
                {/* Heading */}
                <h1 className="font-cool text-[72px] md:text-[144px] leading-[0.79] uppercase font-normal m-0 max-w-[954px] ">
                    get in touch.
                </h1>

                {/* Form */}
                <form
                    className="w-full md:w-[637px] md:shrink-0 flex flex-col gap-[48px] md:gap-[72px]"
                    onSubmit={handleSubmit}
                >
                    {/* Name Field */}
                    <div className="flex flex-col gap-[16px]">
                        <label
                            htmlFor="name"
                            className="font-cool leading-[0.79] uppercase"
                        >
                            name
                        </label>
                        <div className=" border-yellow pl-1 border-b pb-[4px]">
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="YOUR NAME"
                                className="w-full bg-transparent border-none outline-none font-cool text-3xl leading-[0.79] uppercase text-yellow placeholder:text-yellow placeholder:opacity-10 p-0"
                                required
                            />
                        </div>
                    </div>

                    {/* Email Field */}
                    <div className="flex flex-col gap-[16px]">
                        <label
                            htmlFor="email"
                            className="font-cool  leading-[0.79] uppercase"
                        >
                            email
                        </label>
                        <div className="border-yellow pl-1 border-b pb-[4px]">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="YOUR EMAIL"
                                className="w-full bg-transparent border-none outline-none font-cool text-3xl leading-[0.79] uppercase text-yellow placeholder:text-yellow placeholder:opacity-10 p-0"
                                required
                            />
                        </div>
                    </div>

                    {/* Message Field */}
                    <div className="flex flex-col gap-[16px]">
                        <div className="flex gap-[8px] items-start">
                            <span className="font-cool leading-[0.79] uppercase">
                                add a message
                            </span>
                            <span className="font-prov text-xs leading-[0.79] uppercase">
                                (optional)
                            </span>
                        </div>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Lorem ipsum dolor sit amet..."
                            className="w-full h-[166px] bg-yellow text-black font-new text-[18px] leading-none p-[8px] border-none outline-none resize-none placeholder:text-black placeholder:opacity-40"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="self-end font-cool leading-[0.75] text-[24px] uppercase text-black bg-yellow border-none p-0 cursor-pointer text-brown"
                    >
                        submit
                    </button>
                </form>
            </div>
        </div>
    );
}
