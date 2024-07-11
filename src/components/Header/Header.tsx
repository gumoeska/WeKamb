import Logo from "../Logo";
import { Button } from "../ui/button";

const EXAMPLE_CARDS = [
    { id: Math.random().toString(), title: "Criar um botão", column: "Backlog" },
    { id: Math.random().toString(), title: "Criar uma tabela", column: "Backlog" },
    { id: Math.random().toString(), title: "Refatorar componente", column: "Backlog" },
    { id: Math.random().toString(), title: "Ajustar validações", column: "Backlog" },
    { id: Math.random().toString(), title: "Criar nova página", column: "Backlog" },

    { id: Math.random().toString(), title: "Refatorar método", column: "Desenvolvendo" },
    { id: Math.random().toString(), title: "Corrigir bug", column: "Desenvolvendo" },
    { id: Math.random().toString(), title: "Adicionar um novo componente", column: "Desenvolvendo" },

    { id: Math.random().toString(), title: "Adicionar novo botão em um componente existente", column: "Testando" },
    { id: Math.random().toString(), title: "Criar colunas no banco de dados", column: "Testando" },

    { id: Math.random().toString(), title: "Criar tabela no banco de dados", column: "Finalizado" },
    { id: Math.random().toString(), title: "Criar CRUD", column: "Finalizado" },
    { id: Math.random().toString(), title: "Adicionar novas validações", column: "Finalizado" }
];

const EXAMPLE_COLUMNS = [
    { name: "Backlog" },
    { name: "Desenvolvendo" },
    { name: "Testando" },
    { name: "Finalizado" }
];

const Header = () => {
    const setarExemplo = () => {
        localStorage.setItem("cards", JSON.stringify(EXAMPLE_CARDS));
        localStorage.setItem("columns", JSON.stringify(EXAMPLE_COLUMNS));

        window.location.reload();
    }

    return (
        <div className="mx-auto flex flex-row max-w-5xl items-center justify-between gap-16 px-4 py-4 xl:px-0">
            <div className="ml-10">
                <Logo />
            </div>
            <div className="flex flex-row space-x-10 mr-10 items-center">
                <Button variant="ghost" className="px-6" onClick={ () => setarExemplo() }>
                    <h1 className="px-2">
                        Exemplo
                    </h1>
                </Button>
                <Button variant="ghost" className="px-6">
                    <a className="px-2" target="_blank" href="https://github.com/gumoeska">
                        Github
                    </a>
                </Button>
            </div>
        </div>
    );
}

export default Header;