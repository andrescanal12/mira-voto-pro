import miraLogo from "@/assets/mira-logo-espana.png";

const Header = () => {
  return (
    <header className="relative">
      <div className="bg-primary px-4 py-3 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={miraLogo}
              alt="MIRA España"
              className="h-12 w-12 rounded-lg object-cover shadow-lg border border-white/20"
            />
            <div>
              <h1 className="text-lg md:text-xl font-bold text-primary-foreground tracking-tight">
                Sistema de Seguimiento Electoral{" "}
                <span className="text-accent">ALICANTE</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                MIRA España – Partido Político
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-primary-foreground/80">
            <span className="font-semibold">Ana Paola Agudelo</span>
            <span>– Senado Nº 2</span>
            <span className="mx-1">|</span>
            <span className="font-semibold">Alejandra Ospina</span>
            <span>– Cámara Nº 402</span>
          </div>
        </div>
      </div>
      <div className="colombia-stripe" />
    </header>
  );
};

export default Header;
