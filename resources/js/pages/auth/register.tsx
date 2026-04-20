import { login } from '@/routes';
import { store } from '@/routes/register';
import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthEditorialLayout from '@/layouts/auth/auth-editorial-layout';

export default function Register() {
    const { site } = usePage().props as any;
    const authContent = site.auth_content;

    return (
        <AuthEditorialLayout
            title={authContent?.register_title || "Welcome Crew"}
            description={authContent?.register_description || "Enter the manifest to continue your journey."}
        >
            <Head title="Register" />
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="font-semibold text-on-surface-variant ml-1">Nom de Guerre (Name)</Label>
                                <div className="relative">
                                    <Input
                                        id="name"
                                        type="text"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="name"
                                        name="name"
                                        placeholder="Your traveling moniker"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">person</span>
                                </div>
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-on-surface-variant ml-1">Manifest Identity (Email)</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        tabIndex={2}
                                        autoComplete="email"
                                        name="email"
                                        placeholder="explorer@ethereal.com"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">alternate_email</span>
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password" className="font-semibold text-on-surface-variant ml-1">Secret Cipher (Password)</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        tabIndex={3}
                                        autoComplete="new-password"
                                        name="password"
                                        placeholder="••••••••"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">key</span>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="password_confirmation" className="font-semibold text-on-surface-variant ml-1">Confirm Cipher</Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        tabIndex={4}
                                        autoComplete="new-password"
                                        name="password_confirmation"
                                        placeholder="Confirm your hidden sequence"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">verified_user</span>
                                </div>
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full py-6 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-lg rounded-full hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
                                tabIndex={5}
                                data-test="register-user-button"
                            >
                                {processing ? <Spinner /> : (
                                    <>
                                        Board The Ship
                                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" data-icon="sailing">sailing</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        <div className="mt-12 text-center pt-8 border-t border-outline-variant/10">
                            <p className="text-on-surface-variant text-sm">
                                Already in the fleet?{' '}
                                <TextLink href={login()} className="ml-2 font-bold text-secondary hover:text-primary-dim transition-colors underline underline-offset-4" tabIndex={6}>
                                    Log in
                                </TextLink>
                            </p>
                        </div>
                    </>
                )}
            </Form>
        </AuthEditorialLayout>
    );
}
