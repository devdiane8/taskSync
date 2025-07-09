# Shared Library - Database Configuration

Cette librairie partagée contient la configuration de base de données pour tous les microservices du monorepo TaskSync.

## 🗄️ Architecture Base de Données Partagée

Tous les microservices partagent la même base de données PostgreSQL `tasksync_db` mais avec des entités séparées par service.

### Configuration Variables d'Environnement

```bash
# Base de données partagée
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=tasksync_db

# Microservices
USER_SERVICE_PORT=4001
TASK_SERVICE_PORT=4002
NOTIFICATION_SERVICE_PORT=4003
PROJECT_SERVICE_PORT=4004
```

### Utilisation dans les Services

```typescript
import { Module } from '@nestjs/common';
import { PrismaService } from '@app/shared';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
  // ...
})
export class UserModule {}
```

### Structure de la Base de Données

```
tasksync_db/
├── users/           # Entités du User Service
├── tasks/           # Entités du Task Service
├── projects/        # Entités du Project Service
├── notifications/   # Entités du Notification Service
└── migrations/      # Migrations Prisma
```

### Avantages de cette Approche

✅ **Simplicité** : Une seule base de données à gérer
✅ **Transactions** : Possibilité de transactions cross-services
✅ **Requêtes complexes** : Jointures entre entités de différents services
✅ **Cohérence** : Pas de problèmes de synchronisation entre bases
✅ **Type Safety** : Prisma offre une sécurité de type complète
✅ **Auto-completion** : IntelliSense complet avec Prisma Client

### Inconvénients

❌ **Couplage** : Les services sont couplés à la même base
❌ **Scaling** : Difficile de scaler individuellement
❌ **Technologies** : Tous les services doivent utiliser PostgreSQL

## 📁 Structure des Fichiers

```
libs/shared/
├── src/
│   ├── config/
│   │   └── environment.config.ts # Variables d'environnement
│   ├── prisma.service.ts         # Service Prisma partagé
│   └── index.ts                  # Exports principaux
└── README.md
``` 