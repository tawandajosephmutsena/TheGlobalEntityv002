import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AuthEditorialLayout from '@/layouts/auth/auth-editorial-layout';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Form, Head, usePage } from '@inertiajs/react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    const { site } = usePage().props as any;
    const authContent = site.auth_content;

    return (
        <AuthEditorialLayout
            title={authContent?.login_title || "Welcome Back"}
            description={authContent?.login_description || "Sign in to continue your expedition"}
        >
            <Head title="Log in" />

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="font-semibold text-on-surface-variant ml-1">Manifest Identity</Label>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Your registered parchment address"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">alternate_email</span>
                                </div>
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex justify-between items-end px-1">
                                    <Label htmlFor="password" className="font-semibold text-on-surface-variant">Secret Cipher</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-xs font-bold text-tertiary hover:text-primary transition-colors no-underline"
                                            tabIndex={5}
                                        >
                                            Lost your map?
                                        </TextLink>
                                    )}
                                </div>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter your hidden sequence"
                                        className="bg-surface-container-low border-none rounded-lg focus:ring-2 focus:ring-primary/20 text-on-surface placeholder:text-outline/60 transition-all duration-300 pr-10"
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40 pointer-events-none text-sm">key</span>
                                </div>
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3 px-1">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 bg-surface-container-low"
                                />
                                <Label htmlFor="remember" className="text-sm text-on-surface-variant cursor-pointer select-none">Preserve this session</Label>
                            </div>

                            <Button
                                type="submit"
                                className="mt-4 w-full py-6 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold text-lg rounded-full hover:scale-[1.02] transition-transform duration-300 shadow-lg shadow-primary/20 flex items-center justify-center gap-3 group"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing ? <Spinner /> : (
                                    <>
                                        Enter the Fleet
                                        <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform" data-icon="arrow_right_alt">arrow_right_alt</span>
                                    </>
                                )}
                            </Button>
                        </div>

                        {canRegister && (
                            <div className="mt-12 text-center pt-8 border-t border-outline-variant/10">
                                <p className="text-on-surface-variant text-sm">
                                    Not in the fleet yet?{' '}
                                    <TextLink href={register()} className="ml-2 font-bold text-secondary hover:text-primary-dim transition-colors underline underline-offset-4" tabIndex={5}>
                                        Sign up
                                    </TextLink>
                                </p>
                            </div>
                        )}
                    </>
                )}
            </Form>

            {status && (
                <div className="mt-4 text-center text-sm font-medium text-green-600">
                    {status}
                </div>
            )}
        </AuthEditorialLayout>
    );
}
