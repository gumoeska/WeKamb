import { Button } from "../ui/button";

const Footer = () => {
    return (
        <footer className="flex flex-col gap-5 p-5 items-center">
            <div className="flex flex-col items-center">
                <a target="_blank" href="https://www.gumoeska.com">
                    <Button variant={'link'} className="text-md font-thin leading-none text-zinc-400">
                        Gumoeska.com
                    </Button>
                </a>
            </div>
        </footer>
    );
}

export default Footer;