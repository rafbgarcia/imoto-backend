Db.Repo.delete_all(Core.Location)
Db.Repo.delete_all(Core.Motoboy)
Db.Repo.delete_all(Core.Company)
Db.Repo.delete_all(Core.Central)

%{password_hash: pw} = Comeonin.Argon2.add_hash("admin")

unimoto = Db.Repo.insert!(Core.Central.changeset(%Core.Central{}, %{
  name: "Unimoto",
  login: "unimoto",
  password_hash: pw,
}))

Db.Repo.insert!(Core.Company.changeset(%Core.Company{}, %{
  name: "CooperFarma",
  login: "cooperfarma",
  phone_number: "(45) 3523-1771",
  password_hash: pw,
  centrals_ids: [unimoto.id],
  location: %{
    name: "Empresa",
    street: "Av Brasil",
    number: "1215",
    zipcode: "85851-000",
    neighborhood: "Centro",
    city: "Foz do Iguaçu",
    uf: "PR",
  },
}))


Db.Repo.insert!(%Core.Motoboy{name: "Anderson", central_id: unimoto.id, phone_number: "(45) 98888-4444"})
# Db.Repo.insert!(%Core.Motoboy{name: "João", central_id: unimoto.id, login: "joao-token"})
# Db.Repo.insert!(%Core.Motoboy{name: "Pedro", central_id: unimoto.id, login: "pedro-token"})
# Db.Repo.insert!(%Core.Motoboy{name: "Paulo Andrade", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "João Paulo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Mateus", central_id: unimoto.id, login: "mateus-token"})
# Db.Repo.insert!(%Core.Motoboy{name: "Danilo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Tota", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Rafael", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Sandro", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "José", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Silvio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Isac", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Vinicius", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Erasmo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Alfredo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Teodósio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Aurélio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "António", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "César", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Fabricio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Artur", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Afonso", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Herberto", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Guilherme", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Diego", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Romario", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Ronaldo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Victor", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Rodrigo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Antelmo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Helder", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Bonifacio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Altair", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Simão", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Gabriel", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Dimas", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Osvaldo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Rodolfo", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Túlio", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Jeremias", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Mariano", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Dinis", central_id: unimoto.id})
# Db.Repo.insert!(%Core.Motoboy{name: "Viriato", central_id: unimoto.id})

# coopex = Db.Repo.insert!(%Core.Central{name: "Coopex"})
