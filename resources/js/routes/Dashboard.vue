<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <!-- Sidebar -->
    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out',
        'bg-white shadow-xl w-64',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:static'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Логотип -->
        <div class="p-6 border-b">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Coin Fellow
              </h1>
              <p class="text-xs text-gray-500">Личные финансы</p>
            </div>
          </div>
        </div>

        <!-- Навигация -->
        <nav class="flex-1 p-4 space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.name"
            :to="item.path"
            class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600"
            :class="[
              $route.path === item.path 
                ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-500' 
                : 'text-gray-700'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5" />
            <span class="font-medium">{{ item.name }}</span>
            <span v-if="item.badge" class="ml-auto bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
              {{ item.badge }}
            </span>
          </router-link>
        </nav>

        <!-- Профиль пользователя -->
        <div class="p-4 border-t">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
              {{ userInitials }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-900 truncate">{{ userName }}</p>
              <p class="text-sm text-gray-500 truncate">{{ userEmail }}</p>
            </div>
            <button 
              @click="logout"
              class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Выйти"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- Overlay для мобильного меню -->
    <div 
      v-if="mobileMenuOpen"
      @click="mobileMenuOpen = false"
      class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
    ></div>

    <!-- Основной контент -->
    <div class="lg:pl-64">
      <!-- Header - КОМПАКТНАЯ ВЕРСИЯ -->
      <header class="sticky top-0 z-30 bg-white border-b shadow-sm">
        <div class="px-4 sm:px-6 lg:px-6">
          <!-- Верхняя строка - основная информация -->
          <div class="flex items-center justify-between h-16">
            <!-- Левая часть - бургер и заголовок -->
            <div class="flex items-center space-x-4">
              <button 
                @click="mobileMenuOpen = !mobileMenuOpen"
                class="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
              
              <!-- Заголовок для десктопа -->
              <div class="hidden lg:flex items-center space-x-4">
                <h2 class="text-lg font-bold text-gray-900">Дашборд</h2>
                <div class="h-6 w-px bg-gray-300"></div>
                <div class="flex items-center space-x-2">
                  <button 
                    v-for="period in timePeriods"
                    :key="period"
                    @click="selectedPeriod = period"
                    class="px-3 py-1.5 text-sm rounded-lg transition-all"
                    :class="[
                      selectedPeriod === period
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    ]"
                  >
                    {{ period }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Правая часть - дата и кнопка -->
            <div class="flex items-center space-x-4">
              <!-- Дата для десктопа -->
              <div class="hidden lg:flex flex-col items-end">
                <p class="text-sm font-medium text-gray-900">{{ currentDate }}</p>
                <p class="text-xs text-gray-500">{{ currentDay }}</p>
              </div>

              <!-- Кнопка добавления -->
              <button 
                @click="showAddExpense = true"
                class="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:shadow-md transition-all duration-200 active:scale-95"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span class="font-medium text-sm">Добавить</span>
              </button>
            </div>
          </div>

          <!-- Мобильная версия - Периоды времени под header -->
          <div class="lg:hidden py-3 border-t">
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-base font-bold text-gray-900">Дашборд</h2>
                <p class="text-xs text-gray-500">{{ currentDate }}</p>
              </div>
              <div class="flex items-center space-x-1">
                <button 
                  v-for="period in timePeriods.slice(0, 3)"
                  :key="period"
                  @click="selectedPeriod = period"
                  class="px-3 py-1.5 text-sm rounded-lg transition-all"
                  :class="[
                    selectedPeriod === period
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  ]"
                >
                  {{ period }}
                </button>
                <button 
                  @click="showMorePeriods = !showMorePeriods"
                  class="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  ...
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Основной контент -->
      <main class="p-4 sm:p-5 lg:p-6">
        <!-- Быстрая статистика - более компактная -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-md">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-blue-100 text-xs font-medium mb-1">Доходы</p>
                <p class="text-xl font-bold">₽{{ formatNumber(stats.income) }}</p>
              </div>
              <div class="w-10 h-10 bg-blue-400/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-3 flex items-center text-blue-100 text-xs">
              <span v-if="stats.incomeChange > 0" class="flex items-center text-green-300">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                +{{ stats.incomeChange }}%
              </span>
              <span v-else class="flex items-center text-red-300">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                {{ stats.incomeChange }}%
              </span>
              <span class="ml-1 text-blue-100/80">с прошлого периода</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-red-500 to-pink-600 rounded-xl p-5 text-white shadow-md">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-red-100 text-xs font-medium mb-1">Расходы</p>
                <p class="text-xl font-bold">₽{{ formatNumber(stats.expenses) }}</p>
              </div>
              <div class="w-10 h-10 bg-red-400/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
            </div>
            <div class="mt-3 flex items-center text-red-100 text-xs">
              <span v-if="stats.expensesChange > 0" class="flex items-center text-red-300">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
                </svg>
                +{{ stats.expensesChange }}%
              </span>
              <span v-else class="flex items-center text-green-300">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
                </svg>
                {{ stats.expensesChange }}%
              </span>
              <span class="ml-1 text-red-100/80">с прошлого периода</span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white shadow-md">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-green-100 text-xs font-medium mb-1">Баланс</p>
                <p class="text-xl font-bold">₽{{ formatNumber(stats.balance) }}</p>
              </div>
              <div class="w-10 h-10 bg-green-400/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
            </div>
            <div class="mt-3">
              <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium" 
                    :class="stats.balance > 0 ? 'bg-green-100/30 text-green-200' : 'bg-red-100/30 text-red-200'">
                {{ stats.balance > 0 ? 'Положительный' : 'Отрицательный' }}
              </span>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl p-5 text-white shadow-md">
            <div class="flex items-start justify-between">
              <div>
                <p class="text-purple-100 text-xs font-medium mb-1">Бюджет</p>
                <p class="text-xl font-bold">{{ stats.budgetUsed }}%</p>
              </div>
              <div class="w-10 h-10 bg-purple-400/20 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
                </svg>
              </div>
            </div>
            <div class="mt-3">
              <div class="w-full bg-purple-400/30 rounded-full h-1.5">
                <div 
                  class="h-1.5 rounded-full bg-white transition-all duration-300"
                  :style="{ width: stats.budgetUsed + '%' }"
                ></div>
              </div>
              <p class="text-purple-100 text-xs mt-2">
                {{ stats.budgetUsed > 80 ? 'Превышение!' : 'В пределах' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Два  блока -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <!-- График категорий -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-base font-bold text-gray-900">Расходы по категориям</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Распределение ваших расходов</p>
                </div>
                <select v-model="selectedCategoryPeriod" class="text-xs border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 px-2.5 py-1.5 bg-gray-50">
                  <option value="month">Этот месяц</option>
                  <option value="week">Эта неделя</option>
                  <option value="year">Этот год</option>
                </select>
              </div>
              
              <div class="space-y-3">
                <div v-for="category in categories" :key="category.id" class="flex items-center p-2.5 hover:bg-gray-50 rounded-lg transition-colors">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center mr-3" :style="{ backgroundColor: category.color + '20' }">
                    <span class="text-lg" :style="{ color: category.color }">{{ category.icon }}</span>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between mb-1">
                      <div>
                        <span class="text-sm font-medium text-gray-900">{{ category.name }}</span>
                        <span class="text-xs text-gray-500 ml-1.5">{{ category.percentage }}%</span>
                      </div>
                      <span class="text-sm font-bold text-gray-900">₽{{ formatNumber(category.amount) }}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-1.5">
                      <div 
                        class="h-1.5 rounded-full transition-all duration-300" 
                        :style="{
                          width: category.percentage + '%',
                          backgroundColor: category.color
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div class="bg-white rounded-xl shadow-sm p-5 border border-gray-100 h-full">
              <div class="flex items-center justify-between mb-4">
                <div>
                  <h3 class="text-base font-bold text-gray-900">Последние операции</h3>
                  <p class="text-xs text-gray-500 mt-0.5">Недавняя активность</p>
                </div>
                <button class="text-blue-600 hover:text-blue-700 text-xs font-medium">
                  Все →
                </button>
              </div>
              
              <div class="space-y-2.5">
                <div v-for="transaction in recentTransactions" :key="transaction.id" 
                     class="flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div class="flex items-center space-x-2.5">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" 
                         :class="transaction.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                      <span class="text-base">{{ transaction.icon }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {{ transaction.description }}
                      </p>
                      <p class="text-xs text-gray-500 truncate">{{ transaction.category }}</p>
                    </div>
                  </div>
                  <div class="text-right min-w-0 ml-2">
                    <p :class="transaction.type === 'income' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'">
                      {{ transaction.type === 'income' ? '+' : '-' }}₽{{ formatNumber(transaction.amount) }}
                    </p>
                    <p class="text-xs text-gray-500">{{ transaction.time }}</p>
                  </div>
                </div>
              </div>

              <button class="w-full mt-3 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-50 transition-colors">
                Показать все операции →
              </button>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base font-bold text-gray-900">Мои группы</h3>
              <p class="text-xs text-gray-500 mt-0.5">Совместные финансы с друзьями</p>
            </div>
            <button class="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Все группы →
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div v-for="group in userGroups" :key="group.id" 
                 class="bg-white rounded-xl shadow-sm p-4 border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div class="flex items-center justify-between mb-3">
                <div class="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold text-sm">
                  {{ group.name.charAt(0) }}
                </div>
                <span class="text-xs px-2 py-0.5 rounded-full font-medium" 
                      :class="group.balance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'">
                  {{ group.balance >= 0 ? '+' : '' }}₽{{ formatNumber(Math.abs(group.balance)) }}
                </span>
              </div>
              
              <h4 class="text-sm font-bold text-gray-900 mb-0.5 truncate">{{ group.name }}</h4>
              <p class="text-xs text-gray-500 mb-3">{{ group.members }} участников</p>
              
              <div class="flex -space-x-2 mb-3">
                <div v-for="(avatar, index) in group.avatars" :key="index" 
                     class="w-6 h-6 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                  {{ avatar }}
                </div>
                <div v-if="group.members > 3" class="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                  +{{ group.members - 3 }}
                </div>
              </div>

              <button class="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-lg font-medium transition-colors">
                Открыть
              </button>
            </div>

            <div class="bg-white rounded-xl shadow-sm p-4 border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center justify-center cursor-pointer" 
                 @click="createGroup">
              <div class="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-2">
                <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
              </div>
              <p class="text-gray-600 text-sm font-medium">Создать группу</p>
              <p class="text-xs text-gray-500 mt-0.5">Общие финансы</p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
      <div class="flex justify-around items-center h-14">
        <button 
          v-for="item in mobileNavItems"
          :key="item.name"
          @click="goToMobile(item.path)"
          class="flex flex-col items-center justify-center p-1 flex-1"
          :class="[
            currentMobileNav === item.path 
              ? 'text-blue-600' 
              : 'text-gray-500'
          ]"
        >
          <component :is="item.icon" class="w-5 h-5" />
          <span class="text-xs mt-0.5">{{ item.name }}</span>
        </button>
      </div>
    </nav>

    <div v-if="showAddExpense" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl max-w-md w-full p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-bold text-gray-900">Добавить операцию</h3>
          <button @click="showAddExpense = false" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <div class="space-y-3">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Тип операции</label>
            <div class="flex space-x-2">
              <button 
                @click="newExpense.type = 'expense'"
                class="flex-1 py-2.5 rounded-lg border-2 transition-all text-sm font-medium"
                :class="newExpense.type === 'expense' ? 'border-red-500 bg-red-50 text-red-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
              >
                Расход
              </button>
              <button 
                @click="newExpense.type = 'income'"
                class="flex-1 py-2.5 rounded-lg border-2 transition-all text-sm font-medium"
                :class="newExpense.type === 'income' ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'"
              >
                Доход
              </button>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Сумма</label>
            <div class="relative">
              <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₽</span>
              <input
                v-model="newExpense.amount"
                type="number"
                placeholder="0"
                class="w-full pl-9 pr-4 py-2.5 text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
              >
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Категория</label>
            <select v-model="newExpense.category" 
                    class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white text-sm">
              <option value="">Выберите категорию</option>
              <option v-for="cat in expenseCategories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1.5">Описание</label>
            <input
              v-model="newExpense.description"
              type="text"
              placeholder="На что потратили?"
              class="w-full px-3 py-2.5 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 text-sm"
            >
          </div>
        </div>

        <div class="flex space-x-2 mt-6">
          <button 
            @click="showAddExpense = false"
            class="flex-1 py-2.5 border-2 border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Отмена
          </button>
          <button 
            @click="addExpenseHandler"
            class="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg text-sm font-medium hover:shadow-md transition-all active:scale-95"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const HomeIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>`
}

const ChartIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>`
}

const GroupIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>`
}

const SettingsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`
}

const router = useRouter()

const mobileMenuOpen = ref(false)
const selectedPeriod = ref('Сегодня')
const selectedCategoryPeriod = ref('month')
const showAddExpense = ref(false)
const currentMobileNav = ref('/dashboard')
const showMorePeriods = ref(false)

const user = ref({
  name: 'Nicholas Oddone',
  email: 'oddonenso2@gmail.com',
  initials: 'NO'
})

const stats = reactive({
  income: 154200,
  expenses: 87450,
  balance: 66750,
  budgetUsed: 65,
  incomeChange: 12,
  expensesChange: -5
})

const categories = ref([
  { id: 1, name: 'Продукты', amount: 24500, percentage: 28, color: '#3B82F6', icon: '🛒' },
  { id: 2, name: 'Транспорт', amount: 18500, percentage: 21, color: '#10B981', icon: '🚗' },
  { id: 3, name: 'Развлечения', amount: 15200, percentage: 17, color: '#8B5CF6', icon: '🎬' },
  { id: 4, name: 'Кафе', amount: 12800, percentage: 15, color: '#F59E0B', icon: '☕' },
  { id: 5, name: 'Прочее', amount: 16450, percentage: 19, color: '#EF4444', icon: '📦' },
])

const recentTransactions = ref([
  { id: 1, type: 'expense', amount: 1250, description: 'Продукты', category: 'Продукты', time: '2 часа назад', icon: '🛒' },
  { id: 2, type: 'income', amount: 45000, description: 'Зарплата', category: 'Доходы', time: 'Вчера', icon: '💰' },
  { id: 3, type: 'expense', amount: 650, description: 'Такси', category: 'Транспорт', time: 'Вчера', icon: '🚗' },
  { id: 4, type: 'expense', amount: 3200, description: 'Ресторан', category: 'Кафе', time: '2 дня назад', icon: '🍽️' },
  { id: 5, type: 'expense', amount: 890, description: 'Кино', category: 'Развлечения', time: '3 дня назад', icon: '🎬' },
])

const userGroups = ref([
  { id: 1, name: 'Семья', members: 4, balance: 2450, avatars: ['A', 'B', 'C'] },
  { id: 2, name: 'Друзья', members: 6, balance: -1200, avatars: ['D', 'E', 'F'] },
  { id: 3, name: 'Коллеги', members: 8, balance: 0, avatars: ['G', 'H', 'I'] },
  { id: 4, name: 'Путешествие', members: 3, balance: 5600, avatars: ['J', 'K', 'L'] },
])

const newExpense = reactive({
  type: 'expense',
  amount: '',
  category: '',
  description: ''
})

const expenseCategories = ref([
  { id: 1, name: 'Продукты' },
  { id: 2, name: 'Транспорт' },
  { id: 3, name: 'Кафе' },
  { id: 4, name: 'Развлечения' },
  { id: 5, name: 'Здоровье' },
  { id: 6, name: 'Образование' },
  { id: 7, name: 'Одежда' },
  { id: 8, name: 'Красота' },
  { id: 9, name: 'Подарки' },
  { id: 10, name: 'Другое' }
])

const timePeriods = ['Сегодня', 'Вчера', 'Неделя', 'Месяц', 'Год']

const navItems = [
  { name: 'Дашборд', path: '/dashboard', icon: HomeIcon },
  { name: 'Аналитика', path: '/analytics', icon: ChartIcon, badge: 'New' },
  { name: 'Группы', path: '/groups', icon: GroupIcon },
  { name: 'Настройки', path: '/settings', icon: SettingsIcon },
]

const mobileNavItems = [
  { name: 'Главная', path: '/dashboard', icon: HomeIcon },
  { name: 'Группы', path: '/groups', icon: GroupIcon },
  { name: 'Аналитика', path: '/analytics', icon: ChartIcon },
  { name: 'Профиль', path: '/settings', icon: SettingsIcon },
]

const currentDate = computed(() => {
  return new Date().toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const currentDay = computed(() => {
  return new Date().toLocaleDateString('ru-RU', { weekday: 'long' })
})

const userName = computed(() => user.value.name)
const userEmail = computed(() => user.value.email)
const userInitials = computed(() => user.value.initials)

const formatNumber = (num) => {
  return new Intl.NumberFormat('ru-RU').format(num)
}

const logout = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('user')
  router.push('/login')
}

const goToMobile = (path) => {
  currentMobileNav.value = path
  router.push(path)
  mobileMenuOpen.value = false
}

const createGroup = () => {
  const groupName = prompt('Введите название группы:')
  if (!groupName) return
  
  const newGroup = {
    id: Date.now(),
    name: groupName,
    members: 1,
    balance: 0,
    avatars: [userInitials.value]
  }
  
  userGroups.value.unshift(newGroup)
  alert(`Группа "${groupName}" создана!`)
}

const getCategoryIcon = (categoryName) => {
  const icons = {
    'Продукты': '🛒',
    'Транспорт': '🚗',
    'Кафе': '☕',
    'Развлечения': '🎬',
    'Здоровье': '🏥',
    'Образование': '📚',
    'Одежда': '👕',
    'Красота': '💄',
    'Подарки': '🎁',
    'Доходы': '💰',
    'Прочее': '📦'
  }
  return icons[categoryName] || '💸'
}

const updateCategoryPercentages = () => {
  const totalExpenses = categories.value.reduce((sum, cat) => sum + cat.amount, 0)
  categories.value.forEach(category => {
    category.percentage = Math.round((category.amount / totalExpenses) * 100)
  })
}

const resetExpenseForm = () => {
  newExpense.type = 'expense'
  newExpense.amount = ''
  newExpense.category = ''
  newExpense.description = ''
  showAddExpense.value = false
}

const addExpenseHandler = () => {
  if (!newExpense.amount || parseFloat(newExpense.amount) <= 0) {
    alert('Введите корректную сумму')
    return
  }
  
  if (!newExpense.category) {
    alert('Выберите категорию')
    return
  }
  
  const amount = parseFloat(newExpense.amount)
  const category = expenseCategories.value.find(cat => cat.id === parseInt(newExpense.category))
  
  const newTransaction = {
    id: Date.now(),
    type: newExpense.type,
    amount: amount,
    description: newExpense.description || category?.name || 'Без описания',
    category: category?.name || 'Прочее',
    time: 'Только что',
    icon: getCategoryIcon(category?.name),
    date: new Date().toISOString()
  }
  
  recentTransactions.value.unshift(newTransaction)
  
  if (newExpense.type === 'income') {
    stats.income += amount
  } else {
    stats.expenses += amount
    
    const categoryIndex = categories.value.findIndex(c => c.name === category?.name)
    if (categoryIndex !== -1) {
      categories.value[categoryIndex].amount += amount
      updateCategoryPercentages()
    } else {
      categories.value.push({
        id: categories.value.length + 1,
        name: category?.name || 'Прочее',
        amount: amount,
        percentage: 10,
        color: '#6B7280',
        icon: getCategoryIcon(category?.name)
      })
      updateCategoryPercentages()
    }
  }
  
  stats.balance = stats.income - stats.expenses
  stats.budgetUsed = Math.min(Math.round((stats.expenses / stats.income) * 100), 100)
  
  alert('Транзакция успешно добавлена!')
  
  resetExpenseForm()
}

onMounted(() => {
  updateCategoryPercentages()
})
</script>