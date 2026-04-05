import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';
import { type BreadcrumbItem, type SharedData, MediaAsset } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, Link, usePage, useForm } from '@inertiajs/react';
import { Image as ImageIcon } from 'lucide-react';
import React from 'react';

import DeleteUser from '@/components/delete-user';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Twitter, Linkedin, Github, Globe } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import MediaLibrary from '@/components/admin/MediaLibrary';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit().url,
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage<SharedData>().props;

    const { data, setData, patch, processing, recentlySuccessful, errors } = useForm({
        name: auth.user.name,
        email: auth.user.email,
        avatar: auth.user.avatar || '',
        about: auth.user.about || '',
        social_links: {
            twitter: auth.user.social_links?.twitter || '',
            linkedin: auth.user.social_links?.linkedin || '',
            github: auth.user.social_links?.github || '',
            website: auth.user.social_links?.website || '',
        },
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(ProfileController.update.url(), {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <SettingsLayout>
                <div className="space-y-6">
                    <HeadingSmall
                        title="Profile information"
                        description="Update your name and email address"
                    />

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid gap-4 md:grid-cols-4 items-start">
                            <div className="md:col-span-1">
                                <Label>Profile Picture</Label>
                                <div className="mt-2">
                                    <MediaLibrary
                                        currentValue={data.avatar}
                                        onSelect={(asset: MediaAsset) => setData('avatar', asset.url)}
                                        trigger={
                                            <div className="size-24 rounded-full border-2 border-dashed border-muted-foreground/25 flex items-center justify-center cursor-pointer hover:border-agency-accent transition-colors overflow-hidden bg-muted/30">
                                                {data.avatar ? (
                                                    <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="size-8 text-muted-foreground/50" />
                                                )}
                                            </div>
                                        }
                                    />
                                    {errors.avatar && <InputError className="mt-2" message={errors.avatar} />}
                                </div>
                            </div>

                            <div className="md:col-span-3 space-y-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>

                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                        placeholder="Full name"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email address</Label>

                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="about">About Me (Author Bio)</Label>

                                    <Textarea
                                        id="about"
                                        className="mt-1 block w-full min-h-[120px]"
                                        value={data.about}
                                        onChange={(e) => setData('about', e.target.value)}
                                        placeholder="Tell us about yourself. This will show up at the bottom of your blog posts."
                                    />

                                    <InputError
                                        className="mt-2"
                                        message={errors.about}
                                    />
                                </div>

                                <div className="pt-4 space-y-4 border-t border-agency-primary/5 dark:border-white/5">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-agency-accent">Social Links</Label>
                                    
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="twitter" className="flex items-center gap-2">
                                                <Twitter className="size-3.5" /> Twitter
                                            </Label>
                                            <Input
                                                id="twitter"
                                                value={data.social_links.twitter}
                                                onChange={(e) => setData('social_links', { ...data.social_links, twitter: e.target.value })}
                                                placeholder="https://twitter.com/username"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="linkedin" className="flex items-center gap-2">
                                                <Linkedin className="size-3.5" /> LinkedIn
                                            </Label>
                                            <Input
                                                id="linkedin"
                                                value={data.social_links.linkedin}
                                                onChange={(e) => setData('social_links', { ...data.social_links, linkedin: e.target.value })}
                                                placeholder="https://linkedin.com/in/username"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="github" className="flex items-center gap-2">
                                                <Github className="size-3.5" /> GitHub
                                            </Label>
                                            <Input
                                                id="github"
                                                value={data.social_links.github}
                                                onChange={(e) => setData('social_links', { ...data.social_links, github: e.target.value })}
                                                placeholder="https://github.com/username"
                                            />
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="website" className="flex items-center gap-2">
                                                <Globe className="size-3.5" /> Website
                                            </Label>
                                            <Input
                                                id="website"
                                                value={data.social_links.website}
                                                onChange={(e) => setData('social_links', { ...data.social_links, website: e.target.value })}
                                                placeholder="https://yourwebsite.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {mustVerifyEmail &&
                            auth.user.email_verified_at === null && (
                                <div>
                                    <p className="-mt-4 text-sm text-muted-foreground">
                                        Your email address is
                                        unverified.{' '}
                                        <Link
                                            href={send()}
                                            as="button"
                                            className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                        >
                                            Click here to resend the
                                            verification email.
                                        </Link>
                                    </p>

                                    {status ===
                                        'verification-link-sent' && (
                                        <div className="mt-2 text-sm font-medium text-green-600">
                                            A new verification link has
                                            been sent to your email
                                            address.
                                        </div>
                                    )}
                                </div>
                            )}

                        <div className="flex items-center gap-4">
                            <Button
                                disabled={processing}
                                data-test="update-profile-button"
                            >
                                Save
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">
                                    Saved
                                </p>
                            </Transition>
                        </div>
                    </form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}
